import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import RefinementPopup from "@/components/RefinementPopup";
import QuestionCard from "@/components/QuestionCard";
import FeatureCards from "@/components/FeatureCards";
import PromptExamples from "@/components/PromptExamples";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [showRefinement, setShowRefinement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearchInitiated = async (query: string) => {
    setCurrentQuery(query);
    setIsLoading(true);
    setQuestions([]);

    // Extrair número de questões se mencionado no prompt
    const numberMatch = query.match(/(\d+)\s*quest[õo]es/i);
    const requestedLimit = numberMatch ? parseInt(numberMatch[1]) : 3;

    try {
      const { data, error } = await supabase.functions.invoke("fetch-questions", {
        body: { query, limit: requestedLimit }
      });

      if (error) throw error;

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setShowRefinement(true);
      } else {
        toast({
          title: "Nenhuma questão encontrada",
          description: data.message || "Não encontramos questões sobre este tópico no banco de dados.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar as questões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinementComplete = async (query: string, refinedParams: any) => {
    setShowRefinement(false);
    // Você pode adicionar lógica aqui para refinar as questões exibidas
  };

  const handleBack = () => {
    setQuestions([]);
    setCurrentQuery("");
    setShowRefinement(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 bg-background overflow-y-auto">
            {questions.length > 0 ? (
              <div className="container mx-auto px-4 py-8">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="mb-6"
                >
                  ← Nova busca
                </Button>
                <h2 className="text-2xl font-bold mb-6">
                  Questões sobre: {currentQuery}
                </h2>
                <div className="space-y-6">
                  {questions.map((q: any) => (
                    <QuestionCard
                      key={q.id}
                      stem={q.stem}
                      stem_image_path={q.stem_image_path}
                      type={q.type}
                      difficulty={q.difficulty}
                      source={q.source}
                      explanation={q.explanation}
                      choices={q.choice || []}
                    />
                  ))}
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <SearchHero onSearch={handleSearchInitiated} />
                <PromptExamples onPromptSelect={handleSearchInitiated} />
                <FeatureCards />
              </>
            )}
          </div>
          
          {showRefinement && (
            <RefinementPopup
              initialQuery={currentQuery}
              onClose={() => setShowRefinement(false)}
              onRefinementComplete={handleRefinementComplete}
            />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

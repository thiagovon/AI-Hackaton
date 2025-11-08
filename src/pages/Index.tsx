import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import ResultsDisplay from "@/components/ResultsDisplay";
import SearchRefinementChat from "@/components/SearchRefinementChat";
import FeatureCards from "@/components/FeatureCards";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchResult, setSearchResult] = useState<{ query: string; result: string } | null>(null);
  const [refinementMode, setRefinementMode] = useState<{ query: string } | null>(null);
  const { toast } = useToast();

  const handleSearchInitiated = (query: string) => {
    setRefinementMode({ query });
  };

  const handleRefinementComplete = async (query: string, refinedParams: any) => {
    // Build refined query with parameters
    let refinedQuery = query;
    if (refinedParams.banca && refinedParams.banca !== "qualquer") {
      refinedQuery += ` - Banca: ${refinedParams.banca}`;
    }
    if (refinedParams.instituicao && refinedParams.instituicao !== "qualquer") {
      refinedQuery += ` - Instituição: ${refinedParams.instituicao}`;
    }
    if (refinedParams.cargo && refinedParams.cargo !== "qualquer") {
      refinedQuery += ` - Cargo: ${refinedParams.cargo}`;
    }
    if (refinedParams.periodo && refinedParams.periodo !== "qualquer") {
      refinedQuery += ` - Período: ${refinedParams.periodo}`;
    }

    try {
      const { data, error } = await supabase.functions.invoke("search-questions", {
        body: { query: refinedQuery }
      });

      if (error) throw error;

      setSearchResult({ query, result: data.result });
      setRefinementMode(null);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar as questões. Tente novamente.",
        variant: "destructive",
      });
      setRefinementMode(null);
    }
  };

  const handleBack = () => {
    setSearchResult(null);
    setRefinementMode(null);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 bg-background overflow-y-auto">
            {searchResult ? (
              <ResultsDisplay
                query={searchResult.query}
                result={searchResult.result}
                onBack={handleBack}
              />
            ) : refinementMode ? (
              <SearchRefinementChat
                initialQuery={refinementMode.query}
                onBack={handleBack}
                onRefinementComplete={handleRefinementComplete}
              />
            ) : (
              <>
                <SearchHero onSearch={handleSearchInitiated} />
                <FeatureCards />
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

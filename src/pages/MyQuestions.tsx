import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronRight, Star, MessageCircle, Zap, Target, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Question {
  id: string;
  stem: string;
  stem_image_path: string | null;
  difficulty: string;
  type: string;
  source: string | null;
  explanation: string | null;
  created_at: string;
}

interface Choice {
  id: string;
  question_id: string;
  label: string;
  content: string;
  is_correct: boolean;
  position: number;
}

const MyQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [choices, setChoices] = useState<{ [key: string]: Choice[] }>({});
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      
      const { data: questionsData, error: questionsError } = await supabase
        .from("question")
        .select("*")
        .order("created_at", { ascending: false });

      if (questionsError) throw questionsError;

      setQuestions(questionsData || []);

      // Carregar alternativas para cada questão
      if (questionsData && questionsData.length > 0) {
        const questionIds = questionsData.map(q => q.id);
        const { data: choicesData, error: choicesError } = await supabase
          .from("choice")
          .select("*")
          .in("question_id", questionIds)
          .order("position", { ascending: true });

        if (choicesError) throw choicesError;

        // Organizar alternativas por question_id
        const choicesByQuestion: { [key: string]: Choice[] } = {};
        choicesData?.forEach(choice => {
          if (!choicesByQuestion[choice.question_id]) {
            choicesByQuestion[choice.question_id] = [];
          }
          choicesByQuestion[choice.question_id].push(choice);
        });

        setChoices(choicesByQuestion);
      }
    } catch (error) {
      console.error("Erro ao carregar questões:", error);
      toast.error("Erro ao carregar questões");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    // Filtro de busca
    if (searchQuery && !q.stem.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filtro de dificuldade
    if (difficultyFilter.length > 0 && q.difficulty && !difficultyFilter.includes(q.difficulty)) {
      return false;
    }
    
    return true;
  });

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "medium": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "hard": return "bg-red-500/10 text-red-700 dark:text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyLabel = (difficulty: string | null) => {
    switch (difficulty) {
      case "easy": return "Fácil";
      case "medium": return "Média";
      case "hard": return "Difícil";
      default: return "N/A";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 bg-background overflow-hidden">
            <div className="h-full flex">
              {/* Coluna 1: Painel de Filtros */}
              <div className="w-80 border-r border-border bg-muted/30">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6">
                    {/* Busca Rápida */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Busca Rápida</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar no enunciado..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Filtros de Status */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {["all", "done", "correct", "wrong", "viewed", "saved"].map((status) => (
                          <Button
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                            className="text-xs"
                          >
                            {status === "all" && "Todas"}
                            {status === "done" && "Feitas"}
                            {status === "correct" && "Acertadas"}
                            {status === "wrong" && "Erradas"}
                            {status === "viewed" && "Vistas"}
                            {status === "saved" && "⭐️ Salvas"}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Filtros de Dificuldade */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Dificuldade</h3>
                      <div className="space-y-2">
                        {["easy", "medium", "hard"].map((diff) => (
                          <div key={diff} className="flex items-center space-x-2">
                            <Checkbox
                              id={diff}
                              checked={difficultyFilter.includes(diff)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDifficultyFilter([...difficultyFilter, diff]);
                                } else {
                                  setDifficultyFilter(difficultyFilter.filter(d => d !== diff));
                                }
                              }}
                            />
                            <label
                              htmlFor={diff}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {getDifficultyLabel(diff)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Clusters Inteligentes */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Clusters Inteligentes</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                          <Zap className="h-3 w-3 mr-2" />
                          Desafio Rápido (10 difíceis)
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                          <Target className="h-3 w-3 mr-2" />
                          Revisão Cirúrgica
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                          <BookOpen className="h-3 w-3 mr-2" />
                          Tópico para Reforçar
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Coluna 2: Lista de Questões */}
              <div className="flex-1 flex flex-col">
                <div className="border-b border-border p-4 bg-background">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm text-muted-foreground">
                      Exibindo <span className="font-semibold text-foreground">{filteredQuestions.length}</span> de{" "}
                      <span className="font-semibold text-foreground">{questions.length}</span> questões
                    </h2>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Mais Recente</SelectItem>
                        <SelectItem value="difficulty">Dificuldade</SelectItem>
                        <SelectItem value="errors">Mais Erradas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-2">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">Carregando questões...</p>
                      </div>
                    ) : filteredQuestions.length === 0 ? (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">Nenhuma questão encontrada</p>
                      </div>
                    ) : (
                      filteredQuestions.map((question) => (
                        <Card
                          key={question.id}
                          className={`cursor-pointer hover:shadow-md transition-shadow ${
                            selectedQuestion?.id === question.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setSelectedQuestion(question)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              {/* Indicador de Status */}
                              <div className="w-1 bg-muted rounded-full flex-shrink-0" />
                              
                              <div className="flex-1 min-w-0">
                                {/* Snippet do Enunciado */}
                                <p className="text-sm line-clamp-2 mb-2">
                                  {question.stem}
                                </p>
                                
                                {/* Tags de Metadados */}
                                <div className="flex flex-wrap gap-2 items-center">
                                  <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                                    {getDifficultyLabel(question.difficulty)}
                                  </Badge>
                                  {question.source && (
                                    <Badge variant="outline" className="text-xs">
                                      {question.source}
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {question.type}
                                  </Badge>
                                </div>
                              </div>

                              {/* Ações */}
                              <div className="flex gap-2 items-start">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Star className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Coluna 3: Visualização da Questão */}
              {selectedQuestion && (
                <div className="w-[600px] border-l border-border bg-background">
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                      {/* Enunciado */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Enunciado</h3>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedQuestion.stem}
                        </p>
                        {selectedQuestion.stem_image_path && (
                          <img
                            src={selectedQuestion.stem_image_path}
                            alt="Imagem do enunciado"
                            className="mt-4 rounded-lg border border-border max-w-full"
                          />
                        )}
                      </div>

                      <Separator />

                      {/* Alternativas */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Alternativas</h3>
                        <div className="space-y-3">
                          {choices[selectedQuestion.id]?.map((choice) => (
                            <div
                              key={choice.id}
                              className={`p-3 rounded-lg border transition-colors ${
                                choice.is_correct
                                  ? "bg-green-500/10 border-green-500/50"
                                  : "border-border"
                              }`}
                            >
                              <div className="flex gap-3">
                                <span className="font-semibold text-sm">{choice.label})</span>
                                <p className="text-sm flex-1">{choice.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Solução */}
                      {selectedQuestion.explanation && (
                        <>
                          <Separator />
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                <span>Ver Comentário do Professor</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                              <Card>
                                <CardContent className="p-4">
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedQuestion.explanation}
                                  </p>
                                </CardContent>
                              </Card>
                            </CollapsibleContent>
                          </Collapsible>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MyQuestions;

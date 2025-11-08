import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookmarkX, StickyNote } from "lucide-react";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import QuestionNoteEditor from "@/components/QuestionNoteEditor";

interface Question {
  id: string;
  stem: string;
  stem_image_path: string | null;
  type: string;
  difficulty: string | null;
  source: string | null;
  explanation: string | null;
  instituicao: string | null;
  banca: string | null;
  cargo: string | null;
  ano: number | null;
  choice: any[];
}

interface NotebookContentProps {
  notebookId: string | null;
  notebooks: any[];
}

const NotebookContent = ({ notebookId, notebooks }: NotebookContentProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, [notebookId]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (notebookId === "all") {
        // Buscar todas as questões salvas em qualquer caderno
        const { data: notebookQuestions, error: nqError } = await supabase
          .from('notebook_questions')
          .select(`
            question_id,
            notebook_id,
            notebooks!inner(user_id)
          `)
          .eq('notebooks.user_id', user.id);

        if (nqError) throw nqError;

        const questionIds = [...new Set(notebookQuestions?.map(nq => nq.question_id) || [])];
        
        if (questionIds.length === 0) {
          setQuestions([]);
          return;
        }

        const { data: questionsData, error: qError } = await supabase
          .from('question')
          .select(`
            id,
            stem,
            stem_image_path,
            type,
            difficulty,
            source,
            explanation,
            instituicao,
            banca,
            cargo,
            ano,
            choice (
              id,
              label,
              content,
              image_path,
              is_correct,
              position
            )
          `)
          .in('id', questionIds);

        if (qError) throw qError;
        setQuestions(questionsData || []);
      } else {
        // Buscar questões de um caderno específico
        const { data: notebookQuestions, error: nqError } = await supabase
          .from('notebook_questions')
          .select('question_id')
          .eq('notebook_id', notebookId);

        if (nqError) throw nqError;

        const questionIds = notebookQuestions?.map(nq => nq.question_id) || [];
        
        if (questionIds.length === 0) {
          setQuestions([]);
          return;
        }

        const { data: questionsData, error: qError } = await supabase
          .from('question')
          .select(`
            id,
            stem,
            stem_image_path,
            type,
            difficulty,
            source,
            explanation,
            instituicao,
            banca,
            cargo,
            ano,
            choice (
              id,
              label,
              content,
              image_path,
              is_correct,
              position
            )
          `)
          .in('id', questionIds);

        if (qError) throw qError;
        setQuestions(questionsData || []);
      }
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as questões.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromNotebook = async (questionId: string) => {
    try {
      if (notebookId === "all") {
        toast({
          title: "Atenção",
          description: "Selecione um caderno específico para remover questões.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('notebook_questions')
        .delete()
        .eq('notebook_id', notebookId)
        .eq('question_id', questionId);

      if (error) throw error;

      setQuestions(questions.filter(q => q.id !== questionId));
      toast({
        title: "Questão removida",
        description: "A questão foi removida do caderno.",
      });
    } catch (error) {
      console.error("Erro ao remover questão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a questão.",
        variant: "destructive",
      });
    }
  };

  const currentNotebook = notebooks.find(n => n.id === notebookId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {notebookId === "all" ? (
            <>
              <span>⭐️</span>
              Todos os Favoritos
            </>
          ) : (
            <>
              <span>{currentNotebook?.icon}</span>
              {currentNotebook?.name}
            </>
          )}
        </h1>
        <p className="text-muted-foreground mt-2">
          {questions.length === 0
            ? "Nenhuma questão salva ainda"
            : `${questions.length} ${questions.length === 1 ? "questão" : "questões"}`}
        </p>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookmarkX className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma questão salva</h3>
          <p className="text-muted-foreground">
            Comece salvando questões da página inicial ou de "Minhas Questões"
          </p>
        </div>
      ) : selectedQuestionId ? (
        <QuestionNoteEditor
          questionId={selectedQuestionId}
          notebookId={notebookId === "all" ? null : notebookId}
          onClose={() => setSelectedQuestionId(null)}
        />
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="relative">
              <QuestionCard
                stem={question.stem}
                stem_image_path={question.stem_image_path}
                type={question.type}
                difficulty={question.difficulty}
                source={question.source}
                explanation={question.explanation}
                choices={question.choice || []}
              />
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuestionId(question.id)}
                >
                  <StickyNote className="h-4 w-4 mr-2" />
                  Adicionar Nota
                </Button>
                {notebookId !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromNotebook(question.id)}
                  >
                    <BookmarkX className="h-4 w-4 mr-2" />
                    Remover do Caderno
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotebookContent;

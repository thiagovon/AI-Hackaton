import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import QuestionCard from "@/components/QuestionCard";

interface QuestionNoteEditorProps {
  questionId: string;
  notebookId: string | null;
  onClose: () => void;
}

const QuestionNoteEditor = ({ questionId, notebookId, onClose }: QuestionNoteEditorProps) => {
  const [question, setQuestion] = useState<any>(null);
  const [noteContent, setNoteContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestionAndNote();
  }, [questionId]);

  const fetchQuestionAndNote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar questão
      const { data: questionData, error: qError } = await supabase
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
        .eq('id', questionId)
        .single();

      if (qError) throw qError;
      setQuestion(questionData);

      // Buscar nota existente
      let noteQuery = supabase
        .from('question_notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('question_id', questionId);

      if (notebookId) {
        noteQuery = noteQuery.eq('notebook_id', notebookId);
      } else {
        noteQuery = noteQuery.is('notebook_id', null);
      }

      const { data: noteData } = await noteQuery.maybeSingle();
      
      if (noteData) {
        setNoteContent(noteData.content);
      }
    } catch (error) {
      console.error("Erro ao buscar questão e nota:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a questão.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNote = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Atenção",
        description: "Digite uma anotação antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('question_notes')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          notebook_id: notebookId,
          content: noteContent,
        }, {
          onConflict: 'user_id,question_id,notebook_id'
        });

      if (error) throw error;

      toast({
        title: "Nota salva!",
        description: "Sua anotação foi salva com sucesso.",
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a nota.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Questão não encontrada.</p>
        <Button onClick={onClose} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onClose}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para lista
      </Button>

      <QuestionCard
        stem={question.stem}
        stem_image_path={question.stem_image_path}
        type={question.type}
        difficulty={question.difficulty}
        source={question.source}
        explanation={question.explanation}
        choices={question.choice || []}
      />

      <div className="border rounded-lg p-6 bg-card">
        <Label htmlFor="note" className="text-lg font-semibold mb-4 block">
          📝 Minhas Anotações sobre esta Questão
        </Label>
        <Textarea
          id="note"
          placeholder="Por que você salvou esta questão? O que você errou? Algum lembrete importante...
          
Exemplo: 'Lembrar da exceção do Art. 5º! Sempre esqueço que casos de urgência não se aplicam aqui.'"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="min-h-[200px] text-base"
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={saveNote} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Nota
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionNoteEditor;

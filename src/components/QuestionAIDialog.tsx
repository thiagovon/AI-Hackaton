import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

interface QuestionAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionStem: string;
  correctAnswer: string;
}

const QuestionAIDialog = ({ open, onOpenChange, questionStem, correctAnswer }: QuestionAIDialogProps) => {
  const [userQuestion, setUserQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!userQuestion.trim()) {
      toast({
        title: "Digite uma pergunta",
        description: "Por favor, digite o que você gostaria de saber sobre esta questão.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAiResponse("");

    try {
      const { data, error } = await supabase.functions.invoke("explain-question", {
        body: {
          questionStem,
          correctAnswer,
          userQuestion,
        },
      });

      if (error) throw error;

      if (data.explanation) {
        setAiResponse(data.explanation);
      } else {
        throw new Error("Resposta inválida da IA");
      }
    } catch (error: any) {
      console.error("Erro ao obter explicação:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível obter a explicação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUserQuestion("");
    setAiResponse("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Pergunte à IA
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              O que você gostaria de saber sobre esta questão?
            </label>
            <Textarea
              placeholder="Ex: Por que esta é a resposta correta? Existem outros métodos de resolução?"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleAsk} 
            disabled={isLoading || !userQuestion.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Perguntar"
            )}
          </Button>

          {aiResponse && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Resposta da IA:
              </h4>
              <div className="text-sm whitespace-pre-wrap">{aiResponse}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionAIDialog;
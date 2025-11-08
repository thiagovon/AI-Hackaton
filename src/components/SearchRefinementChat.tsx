import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SearchRefinementChatProps {
  initialQuery: string;
  onBack: () => void;
  onRefinementComplete: (query: string, refinedParams: any) => void;
}

const SearchRefinementChat = ({ initialQuery, onBack, onRefinementComplete }: SearchRefinementChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Ótimo! Você quer estudar sobre "${initialQuery}". Para encontrar as questões mais adequadas para você, preciso saber um pouco mais. Você tem preferência por alguma banca organizadora específica?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("refine-search", {
        body: { 
          messages: [
            { role: "user", content: `Tópico inicial: ${initialQuery}` },
            ...newMessages
          ]
        }
      });

      if (error) throw error;

      const assistantMessage = data.result;
      
      setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);

      // Check if refinement is complete
      if (assistantMessage.includes("REFINAMENTO_COMPLETO:")) {
        // Parse the refinement data
        const lines = assistantMessage.split('\n');
        const refinedParams: any = {};
        
        lines.forEach(line => {
          if (line.includes('Banca:')) refinedParams.banca = line.split(':')[1]?.trim();
          if (line.includes('Instituição:')) refinedParams.instituicao = line.split(':')[1]?.trim();
          if (line.includes('Cargo:')) refinedParams.cargo = line.split(':')[1]?.trim();
          if (line.includes('Período:')) refinedParams.periodo = line.split(':')[1]?.trim();
        });

        // Wait a moment to show the summary, then proceed
        setTimeout(() => {
          onRefinementComplete(initialQuery, refinedParams);
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao refinar busca:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onRefinementComplete(initialQuery, {});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Aprimore sua pesquisa</CardTitle>
          <p className="text-sm text-muted-foreground">
            Responda algumas perguntas para encontrar questões mais relevantes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite sua resposta..."
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full mt-4"
            disabled={isLoading}
          >
            Pular refinamento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchRefinementChat;

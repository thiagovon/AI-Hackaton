import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, X, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RefinementPopupProps {
  initialQuery: string;
  onClose: () => void;
  onRefinementComplete: (query: string, refinedParams: any) => void;
}

const RefinementPopup = ({ initialQuery, onClose, onRefinementComplete }: RefinementPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    startRefinement();
  }, []);

  const startRefinement = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("refine-search", {
        body: { 
          messages: [
            { role: "user", content: `Tópico inicial: ${initialQuery}` }
          ]
        }
      });

      if (error) throw error;

      const assistantMessage = data.result;
      setMessages([{ role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("Erro ao iniciar refinamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o refinamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    setIsMinimized(true);
  };

  if (isMinimized) {
    return (
      <div className="fixed top-24 right-6 z-50 animate-fade-in">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => setIsMinimized(false)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleSkip} />
      
      <Card className="relative w-full max-w-2xl shadow-2xl animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Aprimore sua pesquisa</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Informe os detalhes que desejar para encontrar questões mais específicas
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {messages.length === 0 && isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RefinementPopup;

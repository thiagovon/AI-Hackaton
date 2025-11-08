import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, Sparkles } from "lucide-react";
import { useState } from "react";

interface PromptCard {
  prompt: string;
  description: string;
}

const promptCards: PromptCard[] = [
  {
    prompt: "Me mostre 15 questões de Direito Administrativo da banca FGV.",
    description: "Crie um filtro por matéria (Direito Adm.) e banca (FGV) para treinar."
  },
  {
    prompt: "O que a banca FCC mais cobra em Português para cargos de Tribunal?",
    description: "Analise a recorrência de tópicos de Português cobrados pela banca FCC em provas de Tribunais."
  },
  {
    prompt: "Quero um simulado estilo CESPE (Certo/Errado) sobre a Lei 8.112.",
    description: "Gere um simulado no formato C/E da banca Cebraspe sobre legislação específica."
  },
  {
    prompt: "Me ajude com a questão 5 da prova do ITA de Física de 2024.",
    description: "Encontre e explique a resolução da questão 5 da prova do ITA (Física 2024)."
  },
  {
    prompt: "Mostre questões parecidas com essa: [copia e cola o texto da questão].",
    description: "Busque questões no banco de dados com conteúdo e nível de dificuldade semelhantes a esta."
  },
  {
    prompt: "Quais tópicos de Matemática eu mais errei nos últimos 30 dias?",
    description: "Recupere as questões de Matemática que você errou, focando nas suas maiores dificuldades."
  }
];

interface ChatWelcomeProps {
  onPromptSelect: (prompt: string) => void;
}

const ChatWelcome = ({ onPromptSelect }: ChatWelcomeProps) => {
  const [input, setInput] = useState("");

  const handleCardClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onPromptSelect(input.trim());
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl space-y-12">
        {/* Cabeçalho Central */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Olá! Como posso acelerar sua aprovação hoje?
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Faça uma pergunta, peça um simulado ou envie uma questão para análise.
          </p>
        </div>

        {/* Grade de Prompts de Exemplo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promptCards.map((card, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-card/90 backdrop-blur-sm border-border/50"
              onClick={() => handleCardClick(card.prompt)}
            >
              <CardContent className="p-6 space-y-3">
                <p className="font-semibold text-foreground leading-relaxed">
                  {card.prompt}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Barra de Chat */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/50">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite seu comando ou cole o texto de uma questão aqui..."
                className="flex-1 bg-card/90 backdrop-blur-sm border-border/50"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <Mic className="h-5 w-5" />
              </Button>

              <Button
                type="submit"
                size="icon"
                className="shrink-0 bg-primary hover:bg-primary/90"
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWelcome;

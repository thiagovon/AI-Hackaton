import { Sparkles, Paperclip, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChatWelcomeProps {
  onPromptSelect: (prompt: string) => void;
}

const PROMPT_EXAMPLES = [
  {
    prompt: "Me faça um simulado modelo ITA da prova objetiva de Física.",
    description: "Crie um simulado focado em Física, com questões estilo ITA, para treinar."
  },
  {
    prompt: "Me ajude com a questão 3 da prova da FUVEST desse ano (2025).",
    description: "Encontre e explique a resolução da questão específica da prova da FUVEST, ano 2025."
  },
  {
    prompt: "Mostre questões parecidas com essa: [copia e cola o texto da questão].",
    description: "Busque questões no banco de dados com conteúdo e nível de dificuldade semelhantes a esta."
  },
  {
    prompt: "Quais tópicos de Química são mais cobrados nos últimos 5 anos pela Unicamp?",
    description: "Liste os temas de Química mais frequentes em provas da Unicamp dos últimos 5 anos."
  },
  {
    prompt: "Me mostre as questões de matemática que mais errei nos simulados anteriores.",
    description: "Recupere as questões de Matemática que você errou, focando nas suas maiores dificuldades."
  },
  {
    prompt: "Crie um quiz rápido de 5 questões sobre a Revolução Industrial para revisar.",
    description: "Gere um quiz de 5 perguntas sobre a Revolução Industrial para uma revisão imediata."
  }
];

const ChatWelcome = ({ onPromptSelect }: ChatWelcomeProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onPromptSelect(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-between px-4 py-8">
      {/* Header Section */}
      <div className="w-full max-w-5xl space-y-8 text-center flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Olá! Como posso acelerar sua aprovação hoje?
          </h1>
          <p className="text-lg text-muted-foreground">
            Faça uma pergunta, peça um simulado ou envie uma questão para análise.
          </p>
        </div>

        {/* Prompt Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {PROMPT_EXAMPLES.map((example, index) => (
            <button
              key={index}
              onClick={() => onPromptSelect(example.prompt)}
              className="group p-6 rounded-xl bg-card/70 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-card/90 transition-all duration-200 text-left shadow-sm hover:shadow-md"
            >
              <p className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {example.prompt}
              </p>
              <p className="text-sm text-muted-foreground">
                {example.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="w-full max-w-4xl mt-8">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-card/70 backdrop-blur-sm border-2 border-border/50 shadow-lg">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-accent"
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite seu comando ou cole o texto de uma questão aqui..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-accent"
            >
              <Mic className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="h-10 w-10 rounded-full"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWelcome;

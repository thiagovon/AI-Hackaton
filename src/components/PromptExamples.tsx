import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface PromptExamplesProps {
  onPromptSelect: (prompt: string) => void;
}

const prompts = [
  {
    title: "Simulado ESAF",
    prompt: "Me faça um simulado modelo ESAF da prova objetiva de Física.",
    category: "Simulado"
  },
  {
    title: "Questão Específica PF",
    prompt: "Me ajude com a questão 3 da prova de Física do concurso da Polícia Federal de 2024.",
    category: "Questão"
  },
  {
    title: "Questões Similares",
    prompt: "Mostre questões parecidas com essa de Direito Administrativo: [copia e cola o texto da questão].",
    category: "Busca"
  },
  {
    title: "Tópicos FGV",
    prompt: "Quais tópicos de Português são mais cobrados nos últimos 5 anos pela banca FGV?",
    category: "Análise"
  },
  {
    title: "Explicação com Exemplo",
    prompt: "Explique o tema de 'Controle de Constitucionalidade' usando uma questão de exemplo de concurso.",
    category: "Estudo"
  },
  {
    title: "Minhas Dificuldades",
    prompt: "Me mostre as questões de Raciocínio Lógico que mais errei nos simulados anteriores de concursos.",
    category: "Histórico"
  },
  {
    title: "Quiz Rápido",
    prompt: "Crie um quiz rápido de 5 questões sobre Administração Pública para revisar.",
    category: "Quiz"
  },
  {
    title: "Gabarito Comentado",
    prompt: "Dê o gabarito comentado da questão 15 da prova do TCU de 2023.",
    category: "Gabarito"
  },
  {
    title: "Questões Interdisciplinares",
    prompt: "Encontre questões interdisciplinares de Atualidades e Geopolítica sobre política internacional brasileira.",
    category: "Busca"
  },
  {
    title: "Aumentar Dificuldade",
    prompt: "Reformula essa questão: [copia e cola a questão de concurso] deixando ela mais difícil.",
    category: "Edição"
  }
];

const PromptExamples = ({ onPromptSelect }: PromptExamplesProps) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            Experimente estes exemplos
          </h2>
        </div>
        <p className="text-muted-foreground">
          Clique em qualquer card para começar sua busca por questões
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts.map((example, index) => (
          <Card
            key={index}
            className="p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 group"
            onClick={() => onPromptSelect(example.prompt)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {example.category}
                </span>
                <Sparkles className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {example.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {example.prompt}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PromptExamples;

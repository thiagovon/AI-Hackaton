import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
  title: string;
  description: string[];
  examples: string[];
}

const features: Feature[] = [
  {
    title: "Crie seu próprio simulado",
    description: ["Coloque tempo", "Quantidade de questões"],
    examples: [
      "Configure simulados personalizados",
      "Defina cronômetro para cada questão",
      "Escolha o número exato de questões",
    ],
  },
  {
    title: "Use a funcionalidade de áudio",
    description: ["Ouça e responda"],
    examples: [
      "Escute as questões narradas",
      "Responda por voz",
      "Estude em qualquer lugar",
    ],
  },
  {
    title: "Interaja com o gabarito",
    description: [
      "Questione outras formas de resolução",
      "Descubra meios mais eficientes",
      "Veja EXATAMENTE onde você errou",
      "Entenda o seu progresso no tópico",
    ],
    examples: [
      "Analise soluções alternativas",
      "Compare diferentes métodos",
      "Identifique padrões de erro",
    ],
  },
];

const FeatureCards = () => {
  const [openCards, setOpenCards] = useState<number[]>([]);

  const toggleCard = (index: number) => {
    setOpenCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {feature.description.map((desc, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {desc}
                  </p>
                ))}
              </div>

              <Collapsible
                open={openCards.includes(index)}
                onOpenChange={() => toggleCard(index)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between font-normal"
                  >
                    Como usar
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openCards.includes(index) ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-2 pt-2">
                  <div className="rounded-lg bg-muted p-4">
                    <ul className="space-y-2">
                      {feature.examples.map((example, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;

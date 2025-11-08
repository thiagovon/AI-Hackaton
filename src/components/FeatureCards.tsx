import { Card } from "@/components/ui/card";
import { Sparkles, Timer, Mic, Target } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: typeof Timer;
  category: string;
}

const features: Feature[] = [
  {
    title: "Crie seu próprio simulado",
    description: "Configure simulados personalizados com tempo e quantidade de questões exata para treinar no seu ritmo",
    icon: Timer,
    category: "Simulado"
  },
  {
    title: "Use a funcionalidade de áudio",
    description: "Escute as questões narradas e responda por voz. Estude em qualquer lugar, mesmo sem olhar para a tela",
    icon: Mic,
    category: "Áudio"
  },
  {
    title: "Interaja com o gabarito",
    description: "Questione outras formas de resolução, descubra meios mais eficientes e veja EXATAMENTE onde você errou",
    icon: Target,
    category: "Gabarito"
  }
];

interface FeatureCardsProps {
  onFeatureClick?: (feature: string) => void;
}

const FeatureCards = ({ onFeatureClick }: FeatureCardsProps) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            Funcionalidades Principais
          </h2>
        </div>
        <p className="text-muted-foreground">
          Recursos poderosos para potencializar seus estudos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 group"
              onClick={() => onFeatureClick?.(feature.title)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {feature.category}
                  </span>
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {feature.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureCards;

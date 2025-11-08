import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Choice {
  id: string;
  label: string;
  content: string;
  image_path?: string;
  is_correct?: boolean;
  position: number;
}

interface QuestionCardProps {
  stem: string;
  stem_image_path?: string;
  type: string;
  difficulty?: string;
  source?: string;
  explanation?: string;
  choices: Choice[];
}

const QuestionCard = ({ 
  stem, 
  stem_image_path, 
  type, 
  difficulty, 
  source, 
  explanation,
  choices 
}: QuestionCardProps) => {
  const sortedChoices = [...choices].sort((a, b) => a.position - b.position);
  
  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'easy': return 'bg-success/20 text-success';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'hard': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (diff?: string) => {
    switch (diff) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return 'N/A';
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <div className="flex gap-2 mb-3">
          {difficulty && (
            <Badge className={getDifficultyColor(difficulty)}>
              {getDifficultyLabel(difficulty)}
            </Badge>
          )}
          {source && (
            <Badge variant="outline">{source}</Badge>
          )}
        </div>
        <CardTitle className="text-lg font-medium leading-relaxed">
          {stem}
        </CardTitle>
        {stem_image_path && (
          <img 
            src={stem_image_path} 
            alt="Imagem da questão" 
            className="mt-4 rounded-lg max-w-full h-auto"
          />
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedChoices.map((choice) => (
          <div 
            key={choice.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <Checkbox disabled className="mt-1" />
            <div className="flex-1">
              <span className="font-semibold mr-2">{choice.label})</span>
              <span>{choice.content}</span>
              {choice.image_path && (
                <img 
                  src={choice.image_path} 
                  alt={`Alternativa ${choice.label}`}
                  className="mt-2 rounded max-w-sm h-auto"
                />
              )}
            </div>
          </div>
        ))}

        {explanation && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="explanation">
              <AccordionTrigger className="text-sm font-medium">
                Ver explicação
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {explanation}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;

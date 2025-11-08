import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Sparkles, Eye } from "lucide-react";
import QuestionAIDialog from "./QuestionAIDialog";

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

const QuestionCard = ({ stem, stem_image_path, type, difficulty, source, explanation, choices }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);

  const sortedChoices = [...choices].sort((a, b) => a.position - b.position);
  const correctChoice = sortedChoices.find((c) => c.is_correct);

  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case "easy":
        return "bg-success/20 text-success";
      case "medium":
        return "bg-warning/20 text-warning";
      case "hard":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyLabel = (diff?: string) => {
    switch (diff) {
      case "easy":
        return "Fácil";
      case "medium":
        return "Médio";
      case "hard":
        return "Difícil";
      default:
        return "N/A";
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
  };

  const handleShowAnswer = () => {
    setIsSubmitted(true);
  };

  const getChoiceStyle = (choice: Choice) => {
    if (!isSubmitted) return "bg-muted/50 hover:bg-muted";

    if (choice.is_correct) {
      return "bg-success/10 border-2 border-success";
    }

    if (selectedAnswer === choice.id && !choice.is_correct) {
      return "bg-destructive/10 border-2 border-destructive";
    }

    return "bg-muted/50";
  };

  const getChoiceIcon = (choice: Choice) => {
    if (!isSubmitted) return null;

    if (choice.is_correct) {
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    }

    if (selectedAnswer === choice.id && !choice.is_correct) {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }

    return null;
  };

  return (
    <>
      <Card className="w-full animate-fade-in">
        <CardHeader>
          <div className="flex gap-2 mb-3">
            {difficulty && <Badge className={getDifficultyColor(difficulty)}>{getDifficultyLabel(difficulty)}</Badge>}
            {source && <Badge variant="outline">{source}</Badge>}
          </div>
          <CardTitle className="text-lg font-medium leading-relaxed">{stem}</CardTitle>
          {stem_image_path && (
            <img src={stem_image_path} alt="Imagem da questão" className="mt-4 rounded-lg max-w-full h-auto" />
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={isSubmitted}>
            {sortedChoices.map((choice) => (
              <div
                key={choice.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${getChoiceStyle(choice)}`}
              >
                <RadioGroupItem value={choice.id} id={choice.id} className="mt-1" />
                <Label htmlFor={choice.id} className="flex-1 cursor-pointer">
                  <span className="font-semibold mr-2">{choice.label})</span>
                  <span>{choice.content}</span>
                  {choice.image_path && (
                    <img
                      src={choice.image_path}
                      alt={`Alternativa ${choice.label}`}
                      className="mt-2 rounded max-w-sm h-auto"
                    />
                  )}
                </Label>
                {getChoiceIcon(choice)}
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleShowAnswer} disabled={isSubmitted} className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Submeter
            </Button>

            <Button onClick={() => setShowAIDialog(true)} disabled={!isSubmitted} className="flex-1">
              <Sparkles className="mr-2 h-4 w-4" />
              GEN AI
            </Button>
          </div>

          {isSubmitted && !selectedAnswer && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm">
              <p className="font-semibold text-primary">Resposta correta: {correctChoice?.label})</p>
              {explanation && <p className="mt-2 text-muted-foreground">{explanation}</p>}
            </div>
          )}

          {isSubmitted && selectedAnswer && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                selectedAnswer === correctChoice?.id
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              <p className="font-semibold">
                {selectedAnswer === correctChoice?.id
                  ? "✓ Resposta correta!"
                  : `✗ Resposta incorreta. A resposta correta é: ${correctChoice?.label})`}
              </p>
              {explanation && <p className="mt-2 text-muted-foreground">{explanation}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <QuestionAIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        questionStem={stem}
        correctAnswer={correctChoice ? `${correctChoice.label}) ${correctChoice.content}` : ""}
      />
    </>
  );
};

export default QuestionCard;

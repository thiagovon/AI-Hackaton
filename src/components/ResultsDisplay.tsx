import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ResultsDisplayProps {
  query: string;
  result: string;
  onBack: () => void;
}

const ResultsDisplay = ({ query, result, onBack }: ResultsDisplayProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Nova busca
      </Button>

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Questões sobre: {query}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-foreground">
              {result}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;

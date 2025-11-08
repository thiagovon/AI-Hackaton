import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, ExternalLink } from "lucide-react";

const SettingsBilling = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plano e Cobrança</CardTitle>
        <CardDescription>
          Gerencie sua assinatura e métodos de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plano Atual */}
        <div className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Plano PRO</h3>
                <p className="text-sm text-muted-foreground">
                  Acesso completo a todas as funcionalidades
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">Ativo</Badge>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <p>✓ Questões ilimitadas</p>
            <p>✓ Cadernos personalizados</p>
            <p>✓ Análise de desempenho avançada</p>
            <p>✓ Simulados completos</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Gerenciar Assinatura
            </Button>
            <Button variant="ghost">Ver Faturas</Button>
          </div>
        </div>

        {/* Próxima Cobrança */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="font-semibold mb-1">Próxima cobrança</h4>
          <p className="text-sm text-muted-foreground">
            R$ 49,90 em 08 de Dezembro de 2025
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsBilling;

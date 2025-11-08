import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const SettingsAccount = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conta e Segurança</CardTitle>
        <CardDescription>
          Gerencie a segurança da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Autenticação</h3>
              <p className="text-sm text-muted-foreground">
                Sua conta está protegida com senha
              </p>
            </div>
          </div>
          <Button variant="outline">Alterar Senha</Button>
        </div>

        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Sessões Ativas</h3>
          <p className="text-sm text-muted-foreground">
            Você está conectado neste dispositivo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsAccount;

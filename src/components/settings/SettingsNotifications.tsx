import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsNotifications = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('email_notifications')
        .eq('id', user.id)
        .single();

      if (profile) {
        setEmailNotifications(profile.email_notifications ?? true);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    }
  };

  const handleToggle = async (checked: boolean) => {
    try {
      setEmailNotifications(checked);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ email_notifications: checked })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Configurações atualizadas!",
        description: "Suas preferências de notificação foram salvas.",
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Configure como deseja receber atualizações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="email-notifications" className="text-base font-medium">
              Notificações por E-mail
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba atualizações sobre seu progresso e novidades
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={handleToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsNotifications;

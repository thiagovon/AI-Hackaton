import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import { User, Lock, Palette, CreditCard, Bell, Database } from "lucide-react";
import SettingsProfile from "@/components/settings/SettingsProfile";
import SettingsAccount from "@/components/settings/SettingsAccount";
import SettingsAppearance from "@/components/settings/SettingsAppearance";
import SettingsBilling from "@/components/settings/SettingsBilling";
import SettingsNotifications from "@/components/settings/SettingsNotifications";
import SettingsData from "@/components/settings/SettingsData";

type SettingsTab = "profile" | "account" | "appearance" | "billing" | "notifications" | "data";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile" as const, label: "Perfil", icon: User },
    { id: "account" as const, label: "Conta e Segurança", icon: Lock },
    { id: "appearance" as const, label: "Aparência", icon: Palette },
    { id: "billing" as const, label: "Plano e Cobrança", icon: CreditCard },
    { id: "notifications" as const, label: "Notificações", icon: Bell },
    { id: "data" as const, label: "Dados da Conta", icon: Database },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <SettingsProfile />;
      case "account":
        return <SettingsAccount />;
      case "appearance":
        return <SettingsAppearance />;
      case "billing":
        return <SettingsBilling />;
      case "notifications":
        return <SettingsNotifications />;
      case "data":
        return <SettingsData />;
      default:
        return <SettingsProfile />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 bg-background">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-8">Configurações</h1>
              
              <div className="flex gap-8">
                {/* Menu de Navegação */}
                <aside className="w-64 flex-shrink-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                            activeTab === tab.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </aside>

                {/* Área de Conteúdo */}
                <div className="flex-1 max-w-3xl">
                  {renderContent()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NotebookSidebar from "@/components/NotebookSidebar";
import NotebookContent from "@/components/NotebookContent";

interface Notebook {
  id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

const Notebooks = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [newNotebookIcon, setNewNotebookIcon] = useState("📚");
  const [newNotebookColor, setNewNotebookColor] = useState("#3B82F6");
  const { toast } = useToast();

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para acessar seus cadernos.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotebooks(data || []);
    } catch (error) {
      console.error("Erro ao buscar cadernos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus cadernos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNotebook = async () => {
    if (!newNotebookName.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para o caderno.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notebooks')
        .insert([{
          user_id: user.id,
          name: newNotebookName,
          icon: newNotebookIcon,
          color: newNotebookColor,
        }])
        .select()
        .single();

      if (error) throw error;

      setNotebooks([data, ...notebooks]);
      setNewNotebookName("");
      setNewNotebookIcon("📚");
      setNewNotebookColor("#3B82F6");
      setIsCreateDialogOpen(false);
      setSelectedNotebook(data.id);

      toast({
        title: "Caderno criado!",
        description: `"${data.name}" foi criado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao criar caderno:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o caderno.",
        variant: "destructive",
      });
    }
  };

  const deleteNotebook = async (notebookId: string) => {
    try {
      const { error } = await supabase
        .from('notebooks')
        .delete()
        .eq('id', notebookId);

      if (error) throw error;

      setNotebooks(notebooks.filter(n => n.id !== notebookId));
      if (selectedNotebook === notebookId) {
        setSelectedNotebook("all");
      }

      toast({
        title: "Caderno excluído",
        description: "O caderno foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir caderno:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o caderno.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex-1 flex">
            {/* Sidebar de Cadernos */}
            <NotebookSidebar
              notebooks={notebooks}
              selectedNotebook={selectedNotebook}
              onSelectNotebook={setSelectedNotebook}
              onDeleteNotebook={deleteNotebook}
              isLoading={isLoading}
            />

            {/* Área de Conteúdo Principal */}
            <main className="flex-1 bg-background overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : notebooks.length === 0 && selectedNotebook === "all" ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Organize seus estudos!</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Crie seu primeiro caderno para salvar questões de revisão, tópicos difíceis ou erros.
                  </p>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg">
                        <Plus className="h-5 w-5 mr-2" />
                        Criar Primeiro Caderno
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Caderno</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome do Caderno</Label>
                          <Input
                            id="name"
                            placeholder="Ex: Erros Graves - FGV"
                            value={newNotebookName}
                            onChange={(e) => setNewNotebookName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="icon">Ícone (Emoji)</Label>
                          <Input
                            id="icon"
                            placeholder="📚"
                            value={newNotebookIcon}
                            onChange={(e) => setNewNotebookIcon(e.target.value)}
                            maxLength={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color">Cor</Label>
                          <Input
                            id="color"
                            type="color"
                            value={newNotebookColor}
                            onChange={(e) => setNewNotebookColor(e.target.value)}
                          />
                        </div>
                        <Button onClick={createNotebook} className="w-full">
                          Criar Caderno
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <NotebookContent
                  notebookId={selectedNotebook}
                  notebooks={notebooks}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Notebooks;

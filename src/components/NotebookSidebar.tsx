import { Star, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Notebook {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface NotebookSidebarProps {
  notebooks: Notebook[];
  selectedNotebook: string | null;
  onSelectNotebook: (id: string) => void;
  onDeleteNotebook: (id: string) => void;
  isLoading: boolean;
}

const NotebookSidebar = ({
  notebooks,
  selectedNotebook,
  onSelectNotebook,
  onDeleteNotebook,
  isLoading,
}: NotebookSidebarProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [newNotebookIcon, setNewNotebookIcon] = useState("📚");
  const [newNotebookColor, setNewNotebookColor] = useState("#3B82F6");
  const { toast } = useToast();

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

      setNewNotebookName("");
      setNewNotebookIcon("📚");
      setNewNotebookColor("#3B82F6");
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Caderno criado!",
        description: `"${data.name}" foi criado com sucesso.`,
      });
      
      // Recarregar a página para atualizar a lista
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar caderno:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o caderno.",
        variant: "destructive",
      });
    }
  };

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Novo Caderno
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

      <div className="flex-1 overflow-y-auto p-2">
        <button
          onClick={() => onSelectNotebook("all")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1 ${
            selectedNotebook === "all"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          <Star className="h-5 w-5" />
          <span className="font-medium">Todos os Favoritos</span>
        </button>

        <div className="mt-4 space-y-1">
          {notebooks.map((notebook) => (
            <div
              key={notebook.id}
              className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedNotebook === notebook.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <button
                onClick={() => onSelectNotebook(notebook.id)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-sm"
                  style={{ backgroundColor: notebook.color + "20" }}
                >
                  {notebook.icon}
                </span>
                <span className="font-medium truncate">{notebook.name}</span>
              </button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir caderno?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Todas as questões e anotações deste caderno serão removidas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteNotebook(notebook.id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default NotebookSidebar;

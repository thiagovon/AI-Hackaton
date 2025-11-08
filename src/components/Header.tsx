import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-semibold text-foreground">Início</h1>
        <Button 
          variant="outline" 
          className="rounded-full"
          onClick={() => navigate("/auth")}
        >
          Login
        </Button>
      </div>
    </header>
  );
};

export default Header;

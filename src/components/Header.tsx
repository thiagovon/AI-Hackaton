import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <SidebarTrigger className="-ml-1" />
        
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

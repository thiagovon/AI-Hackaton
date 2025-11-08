import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchHeroProps {
  onSearch: (query: string, result: string) => void;
}

const SUGGESTIONS = [
  "Separe 20 questões de Português da FGV",
  "Novas questões do concurso de Ciência de Dados",
  "Questões de Matemática da PRF",
  "Questões de Direito Constitucional",
  "Questões de Raciocínio Lógico para concursos",
  "Questões de Informática para TI",
];

const SearchHero = ({ onSearch }: SearchHeroProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Por favor, digite o que você quer estudar");
      return;
    }

    setShowSuggestions(false);

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("search-questions", {
        body: { query: query.trim() },
      });

      if (error) {
        console.error("Erro:", error);
        
        if (error.message?.includes("429")) {
          toast.error("Muitas requisições. Aguarde um momento e tente novamente.");
        } else if (error.message?.includes("402")) {
          toast.error("Créditos insuficientes. Entre em contato com o suporte.");
        } else {
          toast.error("Erro ao buscar questões. Tente novamente.");
        }
        return;
      }

      if (data?.result) {
        onSearch(query, data.result);
        setQuery("");
      } else {
        toast.error("Nenhum resultado encontrado");
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      toast.error("Erro ao processar sua busca");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-6 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">
            O que você quer estudar?
          </h2>
          <p className="text-lg text-muted-foreground">
            Conseguimos oferecer questões de qualquer tópico de concurso em um clique
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Digite o tópico que deseja estudar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              disabled={isLoading}
              className="h-16 rounded-3xl border-2 border-input pr-14 text-lg shadow-sm transition-all focus:border-primary focus:shadow-md"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading}
              className="absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>

            {showSuggestions && !isLoading && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border-2 border-border bg-card shadow-xl"
              >
                <div className="p-2">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full rounded-xl px-4 py-3 text-left text-base transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchHero;

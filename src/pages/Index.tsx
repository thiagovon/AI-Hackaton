import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import ResultsDisplay from "@/components/ResultsDisplay";
import FeatureCards from "@/components/FeatureCards";

const Index = () => {
  const [searchResult, setSearchResult] = useState<{ query: string; result: string } | null>(null);

  const handleSearch = (query: string, result: string) => {
    setSearchResult({ query, result });
  };

  const handleBack = () => {
    setSearchResult(null);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 bg-background overflow-y-auto">
            {searchResult ? (
              <ResultsDisplay
                query={searchResult.query}
                result={searchResult.result}
                onBack={handleBack}
              />
            ) : (
              <>
                <SearchHero onSearch={handleSearch} />
                <FeatureCards />
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

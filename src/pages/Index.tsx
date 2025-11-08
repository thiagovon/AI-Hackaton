import { useState } from "react";
import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import ResultsDisplay from "@/components/ResultsDisplay";

const Index = () => {
  const [searchResult, setSearchResult] = useState<{ query: string; result: string } | null>(null);

  const handleSearch = (query: string, result: string) => {
    setSearchResult({ query, result });
  };

  const handleBack = () => {
    setSearchResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {searchResult ? (
        <ResultsDisplay
          query={searchResult.query}
          result={searchResult.result}
          onBack={handleBack}
        />
      ) : (
        <SearchHero onSearch={handleSearch} />
      )}
    </div>
  );
};

export default Index;

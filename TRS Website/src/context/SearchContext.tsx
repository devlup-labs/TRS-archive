import { ReactNode, createContext, useState, useContext } from "react";

interface SearchContextProps {
  children: ReactNode;
}

interface SearchContextValues {
  searchQuery: string;
  updateSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextValues | undefined>(undefined);

export const SearchProvider: React.FC<SearchContextProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
  };
  const contextValues: SearchContextValues = {
    searchQuery,
    updateSearchQuery,
  };
  return (
    <SearchContext.Provider value={contextValues}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextValues => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be within a SearchProvider");
  }
  return context;
};

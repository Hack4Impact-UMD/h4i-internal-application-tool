import { SearchContext } from "@/contexts/searchContext";
import { ReactNode, useState } from "react";

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<string>("");

  return (
    <SearchContext.Provider
      value={{
        search: search,
        setSearch: setSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

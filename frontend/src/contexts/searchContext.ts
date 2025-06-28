import { createContext } from "react";

export type SearchContextType = {
  search: string;
  setSearch: (newSearch: string) => void;
};

export const SearchContext = createContext<SearchContextType>({
  search: "",
  setSearch: () => {},
});

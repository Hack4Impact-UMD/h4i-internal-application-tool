import { SearchContext } from "@/contexts/searchContext";
import { useContext } from "react";

export default function useSearch() {
  return useContext(SearchContext);
}

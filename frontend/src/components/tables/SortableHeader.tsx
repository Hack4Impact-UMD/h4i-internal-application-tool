import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Column } from "@tanstack/react-table";
import { ReactNode } from "react";

export default function SortableHeader<T, V>({
  column,
  children,
}: {
  column: Column<T, V>;
  children: ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      className="p-0"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="flex items-center flex-row gap-1">
        {children}
        {column.getIsSorted() === false ? (
          <ArrowUpDown />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowUp />
        ) : (
          <ArrowDown />
        )}
      </span>
    </Button>
  );
}

import { Button } from "@/components/ui/button";

export const RubricScoreButton = ({
  score,
  selected,
  onClick,
  disabled = false,
}: {
  score: number;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <Button
    type="button"
    disabled={disabled}
    aria-pressed={selected}
    onClick={onClick}
    className={`h-14 p-2 grow flex items-center justify-center rounded-md text-sm transition border-none outline-none focus:ring-2 focus:ring-blue-400
        ${selected ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 hover:bg-blue/20"}`}
    style={{ boxShadow: "none" }}
  >
    {score}
  </Button>
);

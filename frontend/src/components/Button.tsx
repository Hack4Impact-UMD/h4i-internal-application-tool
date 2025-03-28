import { twMerge } from "tailwind-merge";

interface ButtonProps {
  className?: string;
  label: string;
  enabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "submit" | "reset" | "button" | undefined;
}

export default function Button({
  className = "",
  label,
  enabled,
  onClick,
  type = undefined,
}: ButtonProps) {
  const classes = twMerge(
    `cursor-pointer disabled:cursor-not-allowed text-white text-lg p-2 m-1 rounded-sm
         focus:border-white ${
           enabled ? "bg-blue hover:bg-darkblue" : "bg-darkgray"
         }`,
    className
  );

  return (
    <button
      className={classes}
      disabled={!enabled}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
}

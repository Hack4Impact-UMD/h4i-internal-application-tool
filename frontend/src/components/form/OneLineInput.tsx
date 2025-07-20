import { twMerge } from "tailwind-merge";
import { Input } from "../ui/input";
import FormMarkdown from "./FormMarkdown";

interface OneLineInputProps {
  question: string;
  label?: string;
  isRequired?: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  minWords?: number;
  maxWords?: number;
  disabled?: boolean;
  errorMessage?: string;
}

const OneLineInput: React.FC<OneLineInputProps> = ({
  question,
  label,
  isRequired,
  value,
  onChange,
  className = "",
  disabled,
  errorMessage,
}) => {
  return (
    <main
      className={twMerge(
        "flex flex-col hover:brightness-95 transition",
        className,
      )}
    >
      <span className="text-xl font-normal">
        {question}
        {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
      </span>

      <FormMarkdown>{label}</FormMarkdown>

      <Input
        className={twMerge(
          "max-w-96 mt-auto p-2 w-full bg-white rounded-md outline outline-black border-2 disabled:cursor-not-allowed disabled:bg-[#DADADA] disabled:opacity-100",
        )}
        required={isRequired}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Enter your response..."
      ></Input>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </main >
  );
};

export default OneLineInput;

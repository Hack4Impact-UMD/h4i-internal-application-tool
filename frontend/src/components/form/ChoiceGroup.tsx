import { useEffect, useState } from "react";
import OptionButton from "./OptionButton";
import { twMerge } from "tailwind-merge";

interface ChoiceGroupProps {
  question: string;
  isRequired?: boolean;
  label?: string;
  value: string;
  options: string[];
  onOptionSelect: (selected: string | null) => void;
  className?: string;
  disabled?: boolean;
}
const ChoiceGroup: React.FC<ChoiceGroupProps> = ({
  question,
  isRequired,
  label,
  value,
  options,
  onOptionSelect,
  className = "",
  disabled,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(value);

  useEffect(() => {
    setSelectedOption(value);
  });

  const handleSelectClick = (optionName: string) => {
    setSelectedOption(optionName);
    onOptionSelect(optionName);
  };

  return (
    <main className={twMerge("flex flex-col min-w-52", className)}>
      <span className="text-xl font-normal">
        {question}{" "}
        {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
      </span>
      <span className="mb-2.5 text-xs font-light">{label}</span>
      <div>
        {options.map((option) => (
          <OptionButton
            key={option}
            optionName={option}
            buttonType="choice"
            isSelected={selectedOption === option}
            onClick={() => handleSelectClick(option)}
            disabled={disabled}
          />
        ))}
      </div>
    </main>
  );
};

export default ChoiceGroup;

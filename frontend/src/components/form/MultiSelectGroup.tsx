import { useEffect, useState } from "react";
import OptionButton from "./OptionButton";
import { twMerge } from "tailwind-merge";

interface MultiSelectGroupProps {
  question: string;
  isRequired?: boolean;
  label?: string;
  value?: string[];
  options: string[];
  onOptionSelect: (selected: string[]) => void;
  displayName?: (key: string) => string;
  className?: string;
  disabled?: boolean;
}

const MultiSelectGroup: React.FC<MultiSelectGroupProps> = ({
  question,
  isRequired,
  label,
  value,
  options,
  onOptionSelect,
  className = "",
  disabled,
  displayName = (k) => k
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value || []);

  const handleSelectClick = (optionName: string) => {
    //NOTE: filtering by name isn't ideal, there might end up being a case
    //where duplicate names are needed. Better to assign an id (index would suffice)
    const updatedSelections = selectedOptions.includes(optionName)
      ? selectedOptions.filter((option) => option !== optionName)
      : [...selectedOptions, optionName];
    setSelectedOptions(updatedSelections);
    onOptionSelect(updatedSelections);
  };

  useEffect(() => {
    setSelectedOptions(value || []);
  }, [value]);

  return (
    <main className={twMerge("flex flex-col min-w-60", className)}>
      <span className="text-xl font-normal">
        {question}{" "}
        {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
      </span>

      <span className="mb-2.5 text-xs font-light">{label}</span>

      <div className="flex flex-wrap gap-1 mt-2">
        {options.map((option) => (
          <OptionButton
            key={option}
            optionName={displayName(option)}
            buttonType="multiSelect"
            isSelected={selectedOptions.includes(option)}
            onClick={() => handleSelectClick(option)}
            disabled={disabled}
          />
        ))}
      </div>
    </main>
  );
};

export default MultiSelectGroup;

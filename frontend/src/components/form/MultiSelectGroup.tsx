import { useEffect, useState } from "react";
import OptionButton from "./OptionButton";

interface MultiSelectGroupProps{
    question: string,
    isRequired?: boolean,
    label?: string
    options: string[],
    onOptionSelect: (selected: string[]) => void;
}

const MultiSelectGroup: React.FC<MultiSelectGroupProps> = ({question, isRequired, label, options, onOptionSelect}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleSelectClick = (optionName: string) => {
        const updatedSelections = selectedOptions.includes(optionName)
            ? selectedOptions.filter((option) => option !== optionName)
            : [...selectedOptions, optionName];

        setSelectedOptions(updatedSelections);
        onOptionSelect(updatedSelections);
    };
  
    return (
        <>
             <main className="flex flex-col min-h-[7vh] w-[65vh]">

                <span className="text-xl font-normal">
                    {question} {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
                </span>

                <span className="mb-2.5 text-xs font-light">{label}</span>

                <div className="flex flex-wrap gap-1 mt-2">
                    {options.map((option) => (
                        <OptionButton
                        key={option}
                        optionName={option}
                        buttonType="multiSelect"
                        isSelected={selectedOptions.includes(option)}
                        onClick={() => handleSelectClick(option)}
                        />
                    ))}
                </div>
            </main>
        </>
    );
}

export default MultiSelectGroup;
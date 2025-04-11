import { useState } from "react";
import OptionButton from "./OptionButton";
import { twMerge } from "tailwind-merge";
import RequireAuth from "../auth/RequireAuth";
import { PermissionRole } from "../../types/types";

interface ChoiceGroupProps {
    question: string,
    isRequired?: boolean,
    label?: string
    options: string[],
    onOptionSelect: (selected: string | null) => void,
    className?: string
}
const ChoiceGroup: React.FC<ChoiceGroupProps> = ({ question, isRequired, label, options, onOptionSelect, className = "" }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelectClick = (optionName: string) => {
        setSelectedOption(optionName);
        onOptionSelect(optionName);
    };

    return (
        <main className={twMerge("flex flex-col min-w-52", className)}>
            <span className="text-xl font-normal">
                {question} {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
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
                    />
                ))}
            </div>
        </main>
    );
}

export default ChoiceGroup;

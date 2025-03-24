import { useState } from "react";
import OptionButton from "./OptionButton";

interface ChoiceGroupProps{
    question: string,
    isRequired?: boolean,
    label?: string
    options: string[],
    onOptionSelect: (selected: string | null) => void;
}
const ChoiceGroup: React.FC<ChoiceGroupProps> = ({question, isRequired, label, options, onOptionSelect}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelectClick = (optionName: string) => {
        setSelectedOption(optionName);
        onOptionSelect(optionName);
    };
  
    return (
        <>
             <main className="flex flex-col min-h-[7vh] w-[27vh]">

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
        </>
    );
}

export default ChoiceGroup;
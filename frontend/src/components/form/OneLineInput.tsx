import { useState } from "react";

interface OneLineInputProps {
    question: string;
    label?: string;
    isRequired: boolean;
}
  
const [value, setValue] = useState("");

const OneLineInput: React.FC<OneLineInputProps> = ({question, label, isRequired }) => {
    return(
        <>
            <main className="flex flex-col min-h-[7vh] w-[27vh] bg-white">

                <span className="text-xl font-normal">
                    {question} {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
                </span>

                <span className="mb-2.5 text-xs font-light">{label}</span>
                <input className="mt-auto p-1 w-full bg-white rounded-md outline outline-black" required={isRequired} onChange={(e) => setValue(e.target.value)}></input>
                
            </main>
        </>
    );
};

export default {OneLineInput, value};
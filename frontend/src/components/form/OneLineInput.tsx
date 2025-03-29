import { twMerge } from "tailwind-merge";

interface OneLineInputProps {
    question: string,
    label?: string,
    isRequired?: boolean,
    value: string,
    onChange: (value: string) => void,
    className?: string
}

const OneLineInput: React.FC<OneLineInputProps> = ({ question, label, isRequired, value, onChange, className = "" }) => {
    return (
        <main className={twMerge("flex flex-col min-w-60", className)}>
            <span className="text-xl font-normal">
                {question} {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
            </span>

            <span className="mb-2.5 text-xs font-light">{label}</span>
            <input className="mt-auto p-1 w-full bg-white rounded-md outline outline-black" required={isRequired} value={value} onChange={(e) => onChange(e.target.value)}></input>
        </main>
    );
};

export default OneLineInput;

import { twMerge } from "tailwind-merge"

interface LongFormInputProps {
    question: string,
    label?: string,
    isRequired?: boolean,
    value: string,
    onChange: (value: string) => void,
    className?: string
}


const LongFormInput: React.FC<LongFormInputProps> = ({ question, label, isRequired, value, onChange, className = "" }) => {
    return (
        <main className={twMerge("flex flex-col min-w-52", className)}>
            <span className="text-xl font-normal">
                {question} {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
            </span>

            <span className="mb-2.5 text-xs font-light">{label}</span>
            <textarea className="p-2 h-32 w-full bg-white rounded-md outline outline-black" required={isRequired} value={value} onChange={(e) => onChange(e.target.value)}></textarea>
        </main>
    );
};

export default LongFormInput;

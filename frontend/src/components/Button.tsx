interface ButtonProps {
    width: string;
    height: string;
    label: string;
    validForm?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ width, height, label, validForm, onClick }: ButtonProps) {
    return (
        <button 
            className={`text-white text-lg m-1 rounded-sm focus:border-white ${
                validForm ? "bg-[#317FD0] hover:bg-[#265FA1]" : "bg-[#C5C5C5]"
            }`}
            style={{ width: `${width}px`, height: `${height}px` }} 
            disabled={!validForm}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
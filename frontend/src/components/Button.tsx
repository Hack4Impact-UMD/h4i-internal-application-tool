import { twMerge } from "tailwind-merge";

interface ButtonProps {
    className?: string;
    label: string;
    validForm?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ className = "", label, validForm, onClick }: ButtonProps) {
    const classes = twMerge(
        `cursor-pointer text-white text-lg p-2 m-1 rounded-sm
         focus:border-white ${validForm ? "bg-[#317FD0] hover:bg-[#265FA1]" :
            "bg-[#C5C5C5]"}`, className)

    return (
        <button
            className={classes}
            disabled={!validForm}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

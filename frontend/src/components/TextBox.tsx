interface TextBoxProps {
    inputType: string;
    className: string;
    label: string;
    invalidLabel?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextBox({ inputType, label, className, invalidLabel, onChange }: TextBoxProps) {
    const borderColor = invalidLabel ? "border-red-500" : "border-transparent";
    const hover = invalidLabel ? "" : "hover:border-black";
    const labelClassName = `flex flex-col justify-around bg-[#F3F3F3] m-1 p-3 border-1 ${borderColor} rounded-sm ${hover}`;

    return (
        <div className={className}>
            <label className={labelClassName}>
                <h4 className="font-bold text-xs text-gray-700">{label}</h4>
                <input type={inputType} className="text-lg font-medium focus:outline-none" onChange={onChange}></input>
            </label>
            {invalidLabel && <div className="flex justify-end p-1"><p className="text-xs text-red-500 ">{invalidLabel}</p></div>}
        </div>
    )
}

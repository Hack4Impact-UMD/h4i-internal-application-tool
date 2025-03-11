interface TextBoxProps {
    inputType: string;
    width: string;
    height: string;
    label: string;
    invalidLabel?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextBox({ inputType, width, height, label, invalidLabel, onChange }: TextBoxProps ) {
    const borderColor = invalidLabel ? "border-red-500" : "border-transparent";
    const hover = invalidLabel ? "" : "hover:border-black";
    var labelClassName = `flex flex-col justify-around bg-[#F3F3F3] m-1 p-3 border-1 ${borderColor} rounded-sm ${hover}`;
    
    return (
        // Had to use inline styling to apply dynamic values for width and height as TailWind does not process these values inside square brackets at runtime
        <div>
            <label className={labelClassName} style={{ width: `${width}px`, height: `${height}px` }}>
                <h4 className="font-bold text-xs text-gray-700">{label}</h4>
                <input type={inputType} className="text-base text-lg font-medium focus:outline-none" onChange={onChange}></input>
            </label>
            {invalidLabel && <div style={{ width: `${width}px`}} className="flex justify-end p-1 ml-1"><p className="text-xs text-red-500 ">{invalidLabel}</p></div>}
        </div>
    )
}
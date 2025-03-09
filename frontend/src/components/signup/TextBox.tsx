interface TextBoxProps {
    inputType: String;
    width: String;
    height: String;
    label: String;
    invalidLabel: String;
}

export default function TextBox({ inputType, width, height, label, invalidLabel }: TextBoxProps ) {
    const labelClassName = "flex flex-col justify-around w-[" + width + "px] h-[" + height + "px] bg-gray-100 m-1 p-3 border-1 border-transparent rounded-sm hover:border-black"
    
    return (
        <label className={labelClassName}>
            <h4 className="font-bold text-xs text-gray-700">{label}</h4>
            <input type={inputType} className="text-base text-lg font-medium focus:outline-none"></input>
        </label>
    )
}
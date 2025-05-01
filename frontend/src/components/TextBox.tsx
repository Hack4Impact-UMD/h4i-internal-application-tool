interface TextBoxProps {
  inputType: string;
  className: string;
  label: string;
  invalidLabel?: string; // TODO: change this to boolean as we'll use error toasts for labels
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextBox({
  inputType,
  label,
  className,
  invalidLabel,
  onChange,
}: TextBoxProps) {
  const borderColor = invalidLabel ? "border-red" : "border-transparent";
  const hover = invalidLabel ? "" : "hover:border-black";
  const labelClassName = `flex flex-col justify-around bg-lightgray m-0 p-3 border-1 ${borderColor} rounded-sm ${hover}`;

  return (
    <div className={className}>
      <label className={labelClassName}>
        <h4 className="font-bold text-xs text-darkgray">{label}</h4>
        <input
          type={inputType}
          className="text-lg font-medium focus:outline-none"
          onChange={onChange}
        ></input>
      </label>
    </div>
  );
}

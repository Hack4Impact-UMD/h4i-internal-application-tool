import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

interface LongFormInputProps {
  question: string;
  label?: string;
  isRequired?: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  minWordCount?: number
  maxWordCount?: number
}

const LongFormInput: React.FC<LongFormInputProps> = ({
  question,
  label,
  isRequired,
  value,
  onChange,
  className = "",
  disabled,
  minWordCount,
  maxWordCount
}) => {
  const wordCount = useMemo(() => {
    const words = value.trim().split(" ")
    if (words.length == 1 && words[0] == "") return 0
    return words.length
  }, [value])

  return (
    <main className={twMerge("flex flex-col min-w-52", className)}>
      <span className="text-xl font-normal">
        {question}{" "}
        {!isRequired && <span className="font-light text-xs"> (Optional)</span>}
      </span>
      <span className="text-xs font-light">{label}</span>
      <p className="text-xs mb-2.5 font-light">{wordCount} word{(wordCount != 1) && 's'}</p>
      <textarea
        className={twMerge(
          "p-2 h-32 w-full rounded-md outline outline-black",
          disabled
            ? "bg-[#DADADA] cursor-not-allowed text-[#202020B2]"
            : "bg-white"
        )}
        required={isRequired}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      ></textarea>
      {(minWordCount && maxWordCount) ?
        <p className="mt-1 text-xs font-light">Minimum: {minWordCount} word{(minWordCount != 1) && 's'}. Maximum: {maxWordCount} word{(minWordCount != 1) && 's'}.</p>
        : (minWordCount) ?
          <p className="mt-1 text-xs font-light">Minimum: {minWordCount} word{(minWordCount != 1) && 's'}.</p>
          : (maxWordCount) ?
            <p className="mt-1 text-xs font-light">Maximum: {maxWordCount} word{(minWordCount != 1) && 's'}.</p>
            : <></>}
    </main>
  );
};

export default LongFormInput;

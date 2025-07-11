import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface DropdownProps {
  options: string[];
  onChange?: (option: string) => void;
  className?: string;
}

const DropdownMenu = ({
  options,
  onChange = () => {},
  className = "",
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    options[0] ?? "Select an option",
  );
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={twMerge(className, "w-32 text-left bg-white z-10 relative")}
    >
      <div
        className={`flex flex-row border-[1.3px] justify-between align-center px-[4px] py-[5px] cursor-pointer
                ${visible ? "border-[#0099EB] rounded-t-[5px]" : "border-[#B8BBC2] rounded-[5px]"}
                `}
        onClick={() => setVisible(!visible)}
      >
        <div>{selectedOption}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 -5 24 24"
        >
          <g fill="none" fillRule="evenodd">
            <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
            <path
              fill="currentColor"
              d="M13.06 16.06a1.5 1.5 0 0 1-2.12 0l-5.658-5.656a1.5 1.5 0 1 1 2.122-2.121L12 12.879l4.596-4.596a1.5 1.5 0 0 1 2.122 2.12l-5.657 5.658Z"
            ></path>
          </g>
        </svg>
      </div>
      {visible && (
        <div className="w-full text-left border-x-[1.3px] border-b-[1.3px] border-[#B8BBC2] rounded-b-[5px] absolute z-[10] bg-white">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelectedOption(option);
                setVisible(false);
                onChange(option);
              }}
              className={`cursor-pointer p-2 hover:bg-lightgray ${selectedOption === option ? "bg-[#C4CBDF]" : ""}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

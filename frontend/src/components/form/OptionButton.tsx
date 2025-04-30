import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface OptionButtonProps {
  optionName: string;
  buttonType: "choice" | "multiSelect";
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  optionName,
  buttonType,
  isSelected,
  onClick,
  className = "",
  disabled,
}) => {
  const [clicked, setClicked] = useState(isSelected);

  // useEffect(() => {
  //   setClicked(isSelected);
  // }, []);

  useEffect(() => {
    if (buttonType === "choice") {
      setClicked(isSelected);
    }
  }, [isSelected, buttonType]);

  const handleClick = () => {
    if (!disabled) {
      setClicked(!clicked);
      onClick();
    }
  };

  const backgroundColor = clicked
    ? "#2969C4" :
    disabled
      ? "#DADADA"
      : "#ffffff";

  const textColor = clicked ? "#ffffff" : disabled ? "#202020B2" : "#202020B2";

  const circleOutlineColor = disabled ? "outline-gray-400" : "outline-black";
  const innerCircleColor = disabled
    ? "bg-gray-400"
    : clicked
      ? "bg-[#2969C4]"
      : "bg-transparent";
  const checkColor = disabled ? "text-gray-400" : "text-blue-600";

  return (
    <button
      onClick={handleClick}
      className={twMerge(
        "flex items-center shadow-md mb-2 min-w-40 cursor-pointer rounded-lg",
        disabled && "cursor-not-allowed",
        className
      )}
      style={{
        padding: "0.3em 0.8em",
        backgroundColor: backgroundColor,
        color: textColor,
      }}
      disabled={disabled}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={twMerge(
            "absolute rounded-full bg-white outline h-4 w-4 flex items-center justify-center",
            circleOutlineColor
          )}
        ></div>
        {buttonType === "choice" ? (
          <div
            className={twMerge("rounded-full h-2 w-2 z-10", innerCircleColor)}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={twMerge(
              "h-3 w-3 z-10",
              clicked ? checkColor : "invisible"
            )}
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.5 6.5l2 2L9.5 3.5"
            />
          </svg>
        )}
      </div>
      <span className="text-md ml-3">{optionName}</span>
    </button>
  );
};

export default OptionButton;

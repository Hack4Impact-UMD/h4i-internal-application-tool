import React, { memo, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface OptionButtonProps {
  optionName: string;
  optionColor?: string;
  optionDarkColor?: string;
  buttonType: "choice" | "multiSelect";
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  errorMessage?: string;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  optionName,
  optionColor = null,
  optionDarkColor = null,
  buttonType,
  isSelected,
  onClick,
  className = "",
  disabled,
  errorMessage,
}) => {
  const [clicked, setClicked] = useState(isSelected);

  // useEffect(() => {
  //   setClicked(isSelected);
  // }, []);

  useEffect(() => {
    setClicked(isSelected);
  }, [isSelected]);

  const handleClick = () => {
    if (!disabled) {
      setClicked(!clicked);
      onClick();
    }
  };

  const backgroundColor =
    optionColor ?? (clicked ? "#2969C4" : disabled ? "#DADADA" : "#ffffff");

  const textColor = optionDarkColor ?? (clicked ? "#ffffff" : "#202020B2");

  const containerShapeClass =
    buttonType === "choice" ? "rounded-full" : "rounded-xs";
  const circleOutlineColor = disabled ? "outline-gray-400" : "outline-black";
  const innerCircleColor = clicked ? "bg-[#2969C4]" : "bg-transparent";
  const checkColor = disabled ? "text-gray-400" : "text-blue-600";

  return (
    <button
      onClick={handleClick}
      className={twMerge(
        "flex items-center shadow-md mb-2 min-w-40 cursor-pointer rounded-lg hover:brightness-95 transition",
        disabled && "cursor-not-allowed",
        className,
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
            "absolute bg-white outline h-4 w-4 flex items-center justify-center",
            containerShapeClass, // Use the variable to set the shape
            circleOutlineColor,
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
              clicked ? checkColor : "invisible",
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
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </button>
  );
};

export default memo(OptionButton);

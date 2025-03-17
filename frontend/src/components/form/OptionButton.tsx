import { useEffect, useState } from "react";

interface OptionButtonProps{
    optionName: string;
    buttonType: "choice" | "multiSelect";
    isSelected: boolean;
    onClick: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({optionName, buttonType, isSelected, onClick}) => {
    const [clicked, setClicked] = useState(false);
    
    useEffect(() => {
      if (buttonType === "choice") {
        setClicked(isSelected);
      }
    }, [isSelected, buttonType]);
    
    const handleClick = () => {
      if (buttonType === "multiSelect") {
        setClicked(!clicked);
      } else {
        onClick();
      }
    };
    
      return (
        <button
          onClick={handleClick}
          className="flex items-center shadow-md"
          style={{
            backgroundColor: clicked ? '#2969C4' : '#ffffff',
            color: clicked ? '#ffffff' : '#202020B2'
          }}
        >
          <div className="relative flex items-center justify-center">
            <div
              className="absolute rounded-full bg-white outline outline-black h-8 w-8 flex items-center justify-center"
            ></div>
            {buttonType === 'choice' ? (
                    <div className={`rounded-full ${clicked ? 'bg-[#2969C4]' : 'bg-transparent'} h-4 w-4 z-10`} />
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${clicked ? '' : 'invisible'} h-6 w-6 text-blue-600 z-10`}
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
          </div>
          <span className="text-lg ml-4">{optionName}</span>
        </button>
      );
};

export default OptionButton;
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
      setClicked(!clicked)
      onClick();
    };
    
      return (
        <button
          onClick={handleClick}
          className="flex items-center shadow-md mb-2 min-w-[10vw]"
          style={{
            padding: "0.3em 0.8em",
            backgroundColor: clicked ? '#2969C4' : '#ffffff',
            color: clicked ? '#ffffff' : '#202020B2'
          }}
        >
          <div className="relative flex items-center justify-center">
            <div
              className="absolute rounded-full bg-white outline outline-black h-4 w-4 flex items-center justify-center"
            ></div>
            {buttonType === 'choice' ? (
                    <div className={`rounded-full ${clicked ? 'bg-[#2969C4]' : 'bg-transparent'} h-2 w-2 z-10`} />
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${clicked ? '' : 'invisible'} h-3 w-3 text-blue-600 z-10`}
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
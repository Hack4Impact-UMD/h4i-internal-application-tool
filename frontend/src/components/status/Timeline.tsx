type TimelineProps = {
  items: { label: string; link?: string }[];
  currentStep: number;
  maxStepReached: number;
  className?: string
  onStepClick?: (index: number) => void;
};

const Timeline = (props: TimelineProps) => {
  const handleStepClick = (index: number) => {
    if (index <= props.maxStepReached && props.onStepClick) {
      props.onStepClick(index);
    }
  };

  return (
    <div className={props.className}>
      <div className="container mx-auto max-w-6xl">
        <ul className="flex justify-between relative gap-x-4 before:absolute before:top-6 before:left-0 before:right-0 before:h-1 before:bg-gray-300">
          {props.items.map((item, index) => {
            const isCompleted = index < props.currentStep;
            const isActive = index === props.currentStep;
            const isUnlocked = index <= props.maxStepReached;

            return (
              <li
                key={item.label}
                className="flex-1 text-center relative z-10"
                onClick={() => handleStepClick(index)}
                style={{ cursor: isUnlocked && !!props.onStepClick ? "pointer" : "default" }}
              >
                <div
                  className={`w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full border-4 transition-colors duration-300 ${isCompleted
                    ? "bg-[#2969C4] text-white border-[#2969C4]"
                    : isActive
                      ? "bg-[#2969C4] text-white border-[#2969C4]"
                      : "bg-white text-gray-500 border-gray-300"
                    }`}
                >
                  {isCompleted ? 
                    // checkmark SVG
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 6.4L4.92857 10L13.5 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  : index + 1}
                </div>
                <p
                  className={`uppercase ${isUnlocked
                    ? "text-gray-800 font-semibold"
                    : "text-gray-400"
                    } whitespace-nowrap`}
                >
                  {item.label}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Timeline;

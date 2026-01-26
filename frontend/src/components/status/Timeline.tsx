import { useEffect, useState } from "react";

type TimelineItem = {
  id: string;
  label: string;
};

type TimelineProps = {
  items: TimelineItem[];
  currentStep: number;
  maxStepReached: number;
  className?: string;
  onStepClick?: (index: number, item: TimelineItem) => void;
};

const Timeline = (props: TimelineProps) => {
  const [visibleItems, setVisibleItems] = useState(props.items.slice(0, 4));
  const [progressIndex, setProgressIndex] = useState(0);

  const handleStepClick = (index: number) => {
    if (index <= props.maxStepReached && props.onStepClick) {
      props.onStepClick(props.currentStep + index - 1, props.items[props.currentStep + index - 1]);
    }
  };

  useEffect(() => {
    const totalItems = props.items.length;

    // -1 to include previous item if possible
    let start = Math.max(props.currentStep - 1, 0);
    let end = start + 4;

    // if out of bounds, just show last four items
    if (end > totalItems) {
      end = totalItems;
      start = Math.max(end - 4, 0);
    }

    setProgressIndex(props.currentStep - start);
    setVisibleItems(props.items.slice(start, end));
  }, [props.currentStep, props.items]);

  return (
    <div className={props.className}>
      <ul className="flex justify-between relative gap-x-4 before:absolute before:top-6 before:left-0 before:right-0 before:h-1 before:bg-gray-300 min-w-full w-fit">
        {visibleItems.map((item, index) => {
          const isCompleted = index < progressIndex;
          const isActive = index === progressIndex;
          const isUnlocked = index <= props.maxStepReached;

          return (
            <li
              key={index}
              className="flex-1 text-center relative z-10"
              onClick={() => handleStepClick(index)}
              style={{
                cursor:
                  isUnlocked && !!props.onStepClick ? "pointer" : "default",
              }}
            >
              <div
                className={`w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full border-4 transition-colors duration-300 ${isCompleted
                  ? "bg-[#2969C4] text-white border-[#2969C4]"
                  : isActive
                    ? "bg-[#2969C4] text-white border-[#2969C4]"
                    : "bg-white text-gray-500 border-gray-300"
                  }`}
              >
                {isCompleted ? (
                  <svg
                    width="15"
                    height="11"
                    viewBox="0 0 15 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 6.4L4.92857 10L13.5 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <p
                className={`uppercase ${isUnlocked ? "text-gray-800 font-semibold" : "text-gray-400"
                  } whitespace-nowrap`}
              >
                {item.label}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Timeline;

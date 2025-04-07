type TimelineProps = {
    items: {label: string, link?: string}[];
    currentStep: number;
    maxStepReached: number;
    onStepClick?: (index: number) => void;
}

const Timeline = (props: TimelineProps) => {

  const handleStepClick = (index: number) => {
    if (index <= props.maxStepReached && props.onStepClick) {
      props.onStepClick(index);
    }
  };

  return (
    <div className="bg-white py-10">
      <div className="container mx-auto max-w-6xl">
        <ul className="flex justify-between relative before:absolute before:top-6 before:left-0 before:right-0 before:h-1 before:bg-gray-300">
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
                  className={`w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full border-4 transition-colors duration-300 ${
                    isCompleted
                      ? "bg-blue-500 text-white border-blue-500"
                      : isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-300"
                  }`}
                >
                  {isCompleted ? "✓" : index}
                </div>
                <p
                  className={`uppercase ${
                    isUnlocked
                      ? "text-gray-800 font-semibold"
                      : "text-gray-400"
                  }`}
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

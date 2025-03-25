const StatusTimeline = () => {
    const currentStep = 1; // 1 = Submitted, 2 = Under Review, etc.
    const items = [
      { label: "Submitted" },
      { label: "Under Review" },
      { label: "Interview" },
      { label: "Decision" },
    ];

    return (
      <div className="bg-white py-10">
        <div className="container mx-auto max-w-6xl">
          <ul className="flex justify-between relative before:absolute before:top-6 before:left-30 before:right-30 before:h-1 before:bg-gray-300">
            {items.map((item, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              return (
                <li key={item.label} className="flex-1 text-center relative z-10">
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
                      isCompleted || isActive
                        ? "text-gray-800 font-semibold"
                        : "text-gray-500"
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

  export default StatusTimeline;
  
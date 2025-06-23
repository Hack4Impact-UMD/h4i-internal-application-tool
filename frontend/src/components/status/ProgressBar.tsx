interface ProgressBarProps {
  fillLevel: number;
}

function ProgressBar({ fillLevel }: ProgressBarProps) {
  const fillPercentage = Math.min((fillLevel / 4) * 100, 100);

  return (
    <div className="flex flex-col gap-1 w-full md:w-[70%] items-center justify-center">
      <div className="flex w-full min-w-80 h-10 rounded-[20px] border-darkgray border shadow-sm shadow-darkgray">
        {fillPercentage > 0 && (
          <div
            className="h-full border-darkgray rounded-[20px] from-lightblue to-teal bg-gradient-to-r"
            style={{ width: `${fillPercentage}%` }}
          />
        )}
      </div>

      <div className="w-full min-w-80 grid grid-cols-[20%_30%_30%_20%] text-center text-[1.5rem] font-light">
        <p className={fillPercentage >= 25 ? "text-darkblue" : ""}>Submitted</p>
        <p className={fillPercentage >= 50 ? "text-darkblue" : ""}>
          Under Review
        </p>
        <p className={fillPercentage >= 75 ? "text-darkblue" : ""}>Interview</p>
        <p className={fillPercentage === 100 ? "text-darkblue" : ""}>
          Decision
        </p>
      </div>
    </div>
  );
}

export default ProgressBar;

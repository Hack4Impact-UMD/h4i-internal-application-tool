interface ProgressBarProps {
    fillLevel: number;
}

function ProgressBar({ fillLevel }: ProgressBarProps) {
    const fillPercentage = Math.min(fillLevel / 4 * 100, 100);

    return (
        <div className="progress-bar-container">
            <div className="bar">
                {fillPercentage > 0 &&
                    <div className="fill" style={{ width: `${fillPercentage}%` }} />}
            </div>

            <div className="labels">
                <p className={fillPercentage >= 25 ? "passed" : ""}>
                    Submitted
                </p>
                <p className={fillPercentage >= 50 ? "passed" : ""}>
                    Under Review
                </p>
                <p className={fillPercentage >= 75 ? "passed" : ""}>
                    Interview
                </p>
                <p className={fillPercentage === 100 ? "passed" : ""}>
                    Decision
                </p>
            </div>
        </div>
    )
}

export default ProgressBar;
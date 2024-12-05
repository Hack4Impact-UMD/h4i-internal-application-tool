import { Status } from '../../../../backend/applicationStatus';

interface StatusBoxProps {
    status: Status;
    applicationUrl: string;
}

function StatusBox({ status, applicationUrl }: StatusBoxProps) {
    const dateStr = "Spring 2025";

    function openDecision() {
        window.open("/status/decision", "_self");
    }

    function openInterviewSchedule() {
        // TODO: Link to Google Calendar interview schedule
        window.open("/", "_blank");
    }

    function openApplication() {
        window.open(applicationUrl, "_blank");
    }

    return (
        <div className="status-box">
            <div className="title-col">
                <p>
                    Hack4Impact {dateStr} Application
                </p>
            </div>

            <div className="status-col">
                <p className="status-col-header">
                    Application Status
                </p>

                <p className="status">
                    {status === 1 && "Submitted"}
                    {status === 2 && "Under Review"}
                    {status === 3.0 && "Interview Pending"}
                    {status === 3.1 && "Interview Scheduled"}
                    {status === 3.2 && "Interview Complete"}
                    {status >= 4 && "Decision Finalized"}
                </p>


                {status === 3.0 &&
                    <div className="button" onClick={() => openInterviewSchedule()}>
                        <p>
                            Schedule Interview
                        </p>
                    </div>}
                {status === 3.1 &&
                    <p className="interview-instructions">
                        Check email for instructions
                    </p>}
                {status >= 4 &&
                    <div className="button" onClick={() => openDecision()}>
                        <p>
                            View Decision
                        </p>
                    </div>}
            </div>

            <div className="download-col">
                <p className="download-col-header">
                    Download Application
                </p>

                <div className="button" onClick={() => openApplication()}>
                    <p>
                        Download
                    </p>
                </div>
            </div>
        </div>
    )
}

export default StatusBox;
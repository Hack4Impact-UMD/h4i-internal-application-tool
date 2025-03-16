import { Status } from '../../services/applicationStatus';

interface StatusBoxProps {
    status: Status;
    applicationUrl: string;
}

function StatusBox({ status, applicationUrl }: StatusBoxProps) {
    const dateStr = "Spring 2025";

    function openDecision() {
        window.open("/decision", "_self");
    }

    function openInterviewSchedule() {
        // TODO: Link to Google Calendar interview schedule
        window.open("/", "_blank");
    }

    function openApplication() {
        window.open(applicationUrl, "_blank");
    }

    return (
        <div className="relative grid grid-rows-[repeat(3,_1fr)] grid-cols-none gap-4 md:grid-cols-[repeat(3,_1fr)] md:grid-rows-none w-full min-w-80 p-4 border-lightblue border-8 rounded-2xl shadow-darkgray shadow-md">
            <div className="w-full">
                <p className="text-2xl font-semibold">
                    Hack4Impact {dateStr} Application
                </p>
            </div>

            <div className="flex flex-col gap-[1rem] items-center justify-start">
                <p className="text-[1.3rem] font-bold">
                    Application Status
                </p>

                <p className="text-[1.2rem] font-light mb-auto">
                    {status === 1 && "Submitted"}
                    {status === 2 && "Under Review"}
                    {status === 3.0 && "Interview Pending"}
                    {status === 3.1 && "Interview Scheduled"}
                    {status === 3.2 && "Interview Complete"}
                    {status >= 4 && "Decision Finalized"}
                </p>


                {status === 3.0 &&
                    <div className="w-44 flex p-1 items-center justify-center rounded-full text-[18px] bg-darkblue text-white cursor-pointer select-none transition-shadow" onClick={() => openInterviewSchedule()}>
                        <p>
                            Schedule Interview
                        </p>
                    </div>}
                {status === 3.1 &&
                    <p className="text-[0.9rem] font-light">
                        Check email for instructions
                    </p>}
                {status >= 4 &&
                    <div className="w-44 flex p-1 items-center justify-center rounded-full text-[18px] bg-darkblue text-white cursor-pointer select-none transition-shadow" onClick={() => openDecision()}>
                        <p>
                            View Decision
                        </p>
                    </div>}
            </div>

            <div className="flex flex-col gap-14 md:items-end">
                <div className="flex h-full flex-col items-center">
                    <p className="text-[1.3rem] font-bold text-center">
                        Download Application
                    </p>

                    <div className="mt-auto w-44 flex p-1 items-center justify-center rounded-full text-[18px] bg-darkblue text-white cursor-pointer select-none transition-shadow" onClick={() => openApplication()}>
                        <p>
                            Download
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default StatusBox;

import { Status } from '../../services/applicationStatus';
import ApplicationTimeline from './ApplicationTimeline';

import Navbar from './Navbar';
import ProgressBar from './ProgressBar';
import StatusBox from './StatusBox';
import StatusTimeline from './ApplicationTimeline.tsx';
import ApplyingTimeline from './ApplyingTimeline.tsx';

function StatusPage() {
    // TODO: Get these fields from the centralized state
    const status = Status.ACCEPTED;
    const applicationUrl = "/";

    // const incompleteApplicationError = "Looks like you haven't submitted your application yet. Please submit when you're ready.";

    return (
        <>
            {/* <Navbar/> */}
            {/* <ApplicationTimeline/> */}
            <ApplyingTimeline/>

            <div className="flex flex-col w-full items-center p-8">
                <div className="flex flex-col w-full gap-5 font-bold max-w-5xl items-center">
                    <h1 className="text-4xl">
                        Current Application Status
                    </h1>

                    <ProgressBar
                        fillLevel={status} />

                    {/* {status === 0 &&
                        <div className="max-w-96 px-4 text-center text-[1.4rem] text-red">
                            <p>
                                {incompleteApplicationError}
                            </p>
                        </div>} */}

                    {status > 0 &&
                        <StatusBox
                            status={status}
                            applicationUrl={applicationUrl} />}

                </div>
            </div>
        </>
    )
}

export default StatusPage;

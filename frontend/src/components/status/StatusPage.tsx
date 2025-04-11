import { ApplicationStatus } from '../../types/types';
import ProgressBar from './ProgressBar';
import StatusBox from './StatusBox';

function StatusPage() {
    // TODO: Get these fields from the centralized state
    const status = ApplicationStatus.Decided;
    const applicationUrl = "/";


    const incompleteApplicationError = "Looks like you haven't submitted your application yet. Please submit when you're ready.";

    return (
        <>
            <div className="flex flex-col w-full items-center p-8">
                <div className="flex flex-col w-full gap-5 font-bold max-w-5xl items-center">
                    <h1 className="text-4xl">
                        Current Application Status
                    </h1>
                    <ProgressBar
                        fillLevel={4} />

                    <StatusBox
                        status={status}
                        applicationUrl={applicationUrl} />
                </div>
            </div>
        </>
    )
}

export default StatusPage;
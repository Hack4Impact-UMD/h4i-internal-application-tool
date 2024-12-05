import { Status } from '../../../../backend/applicationStatus';
import '../../styles/statuspage.css';

import Navbar from './Navbar';
import ProgressBar from './ProgressBar';
import StatusBox from './StatusBox';

function StatusPage() {
    // TODO: Get these fields from the centralized state
    const status = Status.ACCEPTED;
    const applicationUrl = "/";

    const incompleteApplicationError = "Looks like you haven't submitted your application yet. Please submit when you're ready.";

    return (
        <>
            <Navbar />
            <div className="status-page">
                <div className="header">
                    <h1>
                        Current Application Status
                    </h1>
                </div>

                <ProgressBar
                    fillLevel={status} />

                {status === 0 &&
                    <div className="incomplete-application-error">
                        <p>
                            {incompleteApplicationError}
                        </p>
                    </div>}

                {status > 0 &&
                    <StatusBox
                        status={status}
                        applicationUrl={applicationUrl} />}
            </div>
        </>
    )
}

export default StatusPage;
import { useState } from 'react';
import { Status, } from '../../../../backend/applicationStatus';

import Navbar from './Navbar';
import AcceptanceBox from './AcceptanceBox';

function DecisionPage() {
    // TODO: Get this field from the centralized state
    const [status, setStatus] = useState(Status.CONFIRMED);
    if (status < 4) {
        // No decision ready yet
        openStatusPage();
    }

    const dateStr = "Spring 2025";

    const acceptanceMessage =
        <p>
            Hi!<br /><br />

            This is Aaryan Patel, the Director of Recruitment, on behalf of Hack4Impact-UMD. Welcome to
            our organization for {dateStr}! Thank you for your patience during the application and
            interview process. Make sure to check your email for the next steps!<br /><br />

            Sincerely,<br />
            Aaryan Patel (he/him)<br /><br />

            Director of Recruitment | Hack4Impact-UMD
        </p>

    const rejectionMessage =
        <p>
            Hello,<br /><br />

            This is Aaryan Patel, the Director of Recruitment, on behalf of Hack4Impact-UMD. While we
            admire your skills and talent, we received a high volume of applicants this semester, and
            unfortunately have decided to move on with other candidates. We wish you the best in any
            future endeavors.<br /><br />

            Sincerely,<br />
            Aaryan Patel (he/him)<br /><br />

            Director of Recruitment | Hack4Impact-UMD
        </p>;

    function openStatusPage() {
        window.open("/status", "_self");
    }

    return (
        <>
            <Navbar />
            <div className="decision-page">
                <div className="back-button">
                    <p onClick={() => openStatusPage()}>
                        ←Back to Status Page
                    </p>
                </div>

                <div className="content">
                    <div className="message-container">
                        <h1 className="header">
                            {status >= 5 &&
                                `${dateStr} Hack4Impact-UMD Acceptance`}
                            {status === 4 &&
                                `${dateStr} Hack4Impact-UMD Decision`}
                        </h1>

                        <div className="message">
                            {status >= 5 &&
                                acceptanceMessage}
                            {status === 4 &&
                                rejectionMessage}
                        </div>
                    </div>

                    {status >= 5 &&
                        <AcceptanceBox
                            status={status}
                            setStatus={setStatus} />}
                </div>
            </div>
        </>
    )
}

export default DecisionPage;
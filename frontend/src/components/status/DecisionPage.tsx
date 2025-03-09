import { useState } from 'react';
import { Status } from '../../services/applicationStatus';

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
        <div className='w-full flex flex-col items-center'>
            <Navbar isSignedIn={false}/>
            <div className="w-full flex flex-col gap-9 px-10 min-h-[45rem] items-center justify-start bg-cover bg-no-repeat bg-[url(/blue-bg.png)]">
                <div className="self-start p-2 text-center">
                    <p onClick={() => openStatusPage()}>
                        ←Back to Status Page
                    </p>
                </div>

                <div className="flex flex-row w-full gap-10">
                    <div className="grow justify-start bg-white p-12 rounded-xl shadow-darkgray shadow-md border-lightblue border-8">
                        <h1 className="text-center text-[40px] mb-10">
                            {status >= 5 &&
                                `${dateStr} Hack4Impact-UMD Acceptance`}
                            {status === 4 &&
                                `${dateStr} Hack4Impact-UMD Decision`}
                        </h1>

                        <div className="text-lg">
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
        </div>
    )
}

export default DecisionPage;

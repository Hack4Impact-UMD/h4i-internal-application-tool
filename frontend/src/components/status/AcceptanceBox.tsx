import { useState } from 'react';
import { Status, setApplicationStatus } from '../../../../backend/applicationStatus';

interface AcceptanceBoxProps {
    status: Status;
    setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

function AcceptanceBox({ status, setStatus }: AcceptanceBoxProps) {
    const dateStr = "Spring 2025";

    const [confirmation, setConfirmation] = useState("yes");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (confirmation === "yes") {
            setStatus(Status.CONFIRMED);
            // TODO: Set the state application status to CONFIRMED and send an email
        } else {
            setStatus(Status.DECLINED);
            // TODO: Set the state application status to DECLINED and send an email
        }
    };

    return (
        <div className="acceptance-box">
            {status > 5 &&
                <>
                    <div className="header submitted">
                        <p>
                            Decision Submitted!
                        </p>
                    </div>

                    <div className="description">
                        Check your email for further updates.
                    </div>
                </>}

            {status <= 5 &&
                <>
                    <div className="header unsubmitted">
                        <p>
                            Acceptance Confirmation
                        </p>
                    </div>

                    <form className="confirmation-form" onSubmit={handleSubmit}>
                        <label className="question" htmlFor="confirmation-dropdown">
                            <p>
                                Would you like to confirm your position for {dateStr}?
                            </p>
                        </label>

                        <select id="confirmation-dropdown" name="confirmation-dropdown" value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}>
                            <option value="yes">Yes, I confirm.</option>
                            <option value="no">No, I decline.</option>
                        </select>

                        <input className="submit" type="submit" value="Submit" />
                    </form>
                </>}
        </div>
    )
}

export default AcceptanceBox;
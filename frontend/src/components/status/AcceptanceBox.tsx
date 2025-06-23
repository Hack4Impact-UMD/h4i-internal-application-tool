import { useState } from "react";
import { Status } from "../../services/applicationStatus";

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
    <div className="self-start text-center rounded-xl text-3xl relative flex flex-col gap-6 max-w-xs max-h-[490px] w-full p-6 items-center justify-start border-8 border-lightblue shadow-darkgray shadow-md bg-white">
      {status > 5 && (
        <>
          <div className="text-darkblue font-bold">
            <p>Decision Submitted!</p>
          </div>

          <div className="text-lg">Check your email for further updates.</div>
        </>
      )}

      {status <= 5 && (
        <div className="flex flex-col h-full">
          <div>
            <p>Acceptance Confirmation</p>
          </div>

          <form
            className="flex grow h-full min-h-80 flex-col mt-8 gap-2 items-center justify-start"
            onSubmit={handleSubmit}
          >
            <label
              className="text-xl text-left"
              htmlFor="confirmation-dropdown"
            >
              <p>Would you like to confirm your position for {dateStr}?</p>
            </label>

            <select
              className="w-full p-3 border border-darkgray rounded-lg text-lg font-light color-darkgray"
              name="confirmation-dropdown"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            >
              <option value="yes">Yes, I confirm.</option>
              <option value="no">No, I decline.</option>
            </select>

            <div className="grow" />

            <input
              className="rounded-4xl w-48 text-xl bg-darkblue cursor-pointer text-white p-3 h-14"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      )}
    </div>
  );
}

export default AcceptanceBox;

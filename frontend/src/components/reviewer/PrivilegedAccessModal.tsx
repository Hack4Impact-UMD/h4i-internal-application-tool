import { useRef } from "react";

const PrivilegedAccessModal: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleSubmit = () => {};

  return (
    <dialog
      ref={dialogRef}
      open
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-0 border-none bg-transparent"
    >
      <main className="flex flex-row h-[50vh] w-[50vw] rounded-xl bg-[#D9D9D9]">
        <div
          className="text-xl text-[#4E4D4D] ml-3 mt-3 cursor-pointer"
          onClick={closeDialog}
        >
          &larr; Exit
        </div>

        <div className="flex flex-col justify-center items-center h-[85%] w-[75%] text-[#4E4D4D] ml-6 mt-9">
          <div className="flex flex-col justify-center items-center w-[90%]">
            <span className="text-3xl font-bold">Privileged Access</span>
            <span className="text-xl font-medium mt-4">
              Only users with Privileged Access can modify applicant statuses.
            </span>
            <span className="text-xl font-medium mt-4">
              If you do not have the necessary credentials, please contact your
              supervisor for assistance.
            </span>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full items-center"
            >
              <input
                className="w-full mt-7 p-1.5 bg-white rounded-md outline outline-black"
                type="password"
                placeholder="Enter password"
              />
              <button
                className="mt-8 text-white w-[60%] bg-[#2969C4]"
                type="submit"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </main>
    </dialog>
  );
};

export default PrivilegedAccessModal;

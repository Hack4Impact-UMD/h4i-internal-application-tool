import { toast } from "react-toastify";

type ErrorToastProps = {
    message: string;
    closeToast?: () => void;
};

export function ErrorToast({ message, closeToast }: ErrorToastProps) {
    return (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded-xl shadow-lg p-4 flex items-start gap-2 max-w-md z-50">
            <span>🚫</span>
            <div className="flex-1 text-sm">{message}</div>
            <span onClick={closeToast} className="cursor-pointer text-red-800 hover:text-red-600 ">
                X
            </span>
        </div>
    )
};

export function throwErrorToast(message: string): void {
    toast.error(<ErrorToast message={message} />, {
        icon: false,
        closeButton: false,
        hideProgressBar: true,
    });
};

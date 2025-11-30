import { toast } from "react-toastify";

type SuccessToastProps = {
  message: string;
  closeToast?: () => void;
};

export default function SuccessToast({
  message,
  closeToast,
}: SuccessToastProps) {
  return (
    <div className="bg-green-100 text-black border border-green-300 rounded-xl shadow-lg p-4 flex items-start justify-center gap-2 max-w-md z-50">
      <span>✅</span>
      <div className="flex-1 text-sm">{message}</div>
      <span onClick={closeToast} className="cursor-pointer">
        X
      </span>
    </div>
  );
}

export function throwSuccessToast(message: string, autoClose: number = 2000) {
  toast.success(<SuccessToast message={message} />, {
    closeButton: false,
    hideProgressBar: true,
    icon: false,
    autoClose: autoClose,
  });
}

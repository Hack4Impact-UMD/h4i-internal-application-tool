import { CheckIcon } from "lucide-react";
import { toast } from "react-toastify";

export default function SuccessToast({ message }: { message: string }) {
  return (
    <div className="bg-green-100 text-black border border-green-300 rounded-xl shadow-lg p-4 flex items-start gap-2 max-w-md z-50">
      <CheckIcon></CheckIcon>
      <div className="flex-1 text-sm">{message}</div>
    </div>
  );
}

export function throwSuccessToast(message: string) {
  toast.success(<SuccessToast message={message} />, {
    closeButton: false,
    hideProgressBar: true,
    icon: false,
  });
}

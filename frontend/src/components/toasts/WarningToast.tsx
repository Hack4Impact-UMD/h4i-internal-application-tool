import { ShieldAlertIcon } from "lucide-react";
import { toast } from "react-toastify";

export default function WarningToast({ message }: { message: string }) {
  return (
    <div className="bg-[#FEF9C3] text-black border border-[#F8E6BA] rounded-xl shadow-lg p-4 flex items-start gap-2 max-w-md z-50">
      <ShieldAlertIcon></ShieldAlertIcon>
      <div className="flex-1 text-sm">{message}</div>
    </div>
  );
}

export function throwWarningToast(message: string) {
  toast.success(<WarningToast message={message} />, {
    closeButton: false,
    hideProgressBar: true,
    icon: false,
  });
}

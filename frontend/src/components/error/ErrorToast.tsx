type ErrorToastProps = {
    message: string;
    onClose: () => void;
};

export default function ErrorToast({ message, onClose}: ErrorToastProps) {
    return (
        <div className="fixed bottom-5 right-5 bg-red-100 text-red-800 border border-red-300 rounded-xl shadow-lg p-4 flex items-start gap-2 max-w-md z-50">
            <span>🚫</span>
            <div className="flex-1">{message}</div>
            <span onClick={onClose} className="cursor-pointer text-red-800 hover:text-red-600 ">
                X
            </span>
        </div>
    )
}
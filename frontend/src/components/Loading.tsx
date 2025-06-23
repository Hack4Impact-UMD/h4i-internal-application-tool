export default function Loading() {
  return (
    <div className="w-full p-4 h-full flex gap-3 flex-col items-center justify-center">
      <img
        className="w-full max-w-72 animate-pulse"
        src="/h4i_umd_logo.png"
        alt="hack4impact-UMD"
      />
      <p className="text-center">Doing some important stuff, hold on...</p>
    </div>
  );
}

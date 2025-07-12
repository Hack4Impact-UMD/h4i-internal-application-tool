import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <img
        src="/h4i-logo.png"
        alt="Hack4Impact Logo"
        className="w-40 h-40 mb-8"
      />
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl mt-4 text-gray-600">Page Not Found</p>
      <p className="text-md text-muted-foreground mt-2 mb-8">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-blue hover:bg-blue/80 transition text-white font-bold py-2 px-4 rounded"
      >
        Take me home!
      </Link>
    </div>
  );
}

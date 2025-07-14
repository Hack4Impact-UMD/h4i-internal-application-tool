import { Link } from "react-router-dom";

type ErrorPageProps = {
  errorCode: number;
  errorDescription?: string; // for custom messages detailing the error past the error code's official meaning
};

const errorCodeToMeaning: Record<number, string> = {
  404: "Page Not Found",
  403: "Forbidden",
};

// TODO: replace placeholder error messages throughout the app with this component
export default function ErrorPage(props: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <img
        src="/h4i-logo.png"
        alt="Hack4Impact Logo"
        className="w-40 h-40 mb-8"
      />
      <h1 className="text-6xl font-bold text-gray-800">{props.errorCode}</h1>
      <p className="text-2xl mt-4 text-gray-600">
        {errorCodeToMeaning[props.errorCode]}
      </p>
      <p className="text-md text-muted-foreground mt-2 mb-8">
        {props.errorDescription}
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

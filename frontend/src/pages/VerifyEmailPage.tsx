import { throwErrorToast } from "@/components/toasts/ErrorToast";
import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser, sendVerificationEmail } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const { isAuthed, user } = useAuth();

  const sendMutation = useMutation({
    mutationFn: async () => {
      const user = auth.currentUser;
      if (!user) {
        throwErrorToast(
          "Current user is not authenticated, unable to send email!",
        );
        return;
      }
      await sendVerificationEmail(user);
    },
    onError: (err) => {
      console.log("Failed to send verification email: ", err);
      throwErrorToast(
        "Failed to send verification email! Make sure the email address is valid.",
      );
    },
  });

  useEffect(() => {
    if (auth.currentUser?.emailVerified) {
      logoutUser();
    }
  }, []);

  const handleSend = useCallback(() => {
    sendMutation.mutate();
  }, [sendMutation]);

  if (!isAuthed) return <Navigate to="/" />;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <img
        src="/h4i-logo.png"
        alt="Hack4Impact Logo"
        className="w-40 h-40 mb-8"
      />
      <h1 className="text-2xl font-bold text-gray-800">
        Verify your {user?.email} email!
      </h1>
      <p className="text-md text-muted-foreground mt-2 mb-8 max-w-lg">
        A verification email has been sent to {user?.email}. Click the
        verification link, then reload this page.{" "}
        <strong>Make sure to check your spam!</strong> If you have not received
        the email, click the re-send button below.
      </p>
      <div className="flex">
        <Button
          className="bg-blue hover:bg-blue/80 transition text-white font-bold py-2 px-4 rounded"
          onClick={handleSend}
          disabled={sendMutation.isPending}
        >
          Re-send Verification Email
        </Button>
        <Button
          className="bg-blue hover:bg-blue/80 transition text-white font-bold py-2 px-4 rounded ml-3"
          onClick={() => window.location.reload()}
          disabled={sendMutation.isPending}
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
}

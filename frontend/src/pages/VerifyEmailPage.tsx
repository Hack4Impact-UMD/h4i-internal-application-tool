import { throwErrorToast } from "@/components/toasts/ErrorToast";
import { throwSuccessToast } from "@/components/toasts/SuccessToast";
import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser, sendVerificationEmail } from "@/services/userService";
import { useCallback } from "react";
import { Navigate } from "react-router-dom";

export default function VerifyEmailPage() {
	const { isAuthed, user } = useAuth()

	const handleSend = useCallback(async () => {
		const user = auth.currentUser
		if (!user) {
			throwErrorToast("Current user is not authenticated, unable to send email!");
			return;
		}
		await sendVerificationEmail(user)
	}, [])

	if (!isAuthed) return <Navigate to="/" />

	if (auth.currentUser?.emailVerified) {
		logoutUser()
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
			<img
				src="/h4i-logo.png"
				alt="Hack4Impact Logo"
				className="w-40 h-40 mb-8"
			/>
			<h1 className="text-2xl font-bold text-gray-800">Verify your {user?.email} email!</h1>
			<p className="text-md text-muted-foreground mt-2 mb-8 max-w-lg">
				A verification email has been sent to {user?.email}. Click the verification link, then reload this page.
				If you have not received the email, click the re-send button below.
			</p>
			<Button
				className="bg-blue hover:bg-blue/80 transition text-white font-bold py-2 px-4 rounded"
				onClick={handleSend}
			>
				Re-send Verification Email
			</Button>
		</div>
	);
}

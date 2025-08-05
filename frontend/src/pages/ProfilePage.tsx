import OneLineInput from "@/components/form/OneLineInput";
import { throwSuccessToast } from "../components/toasts/SuccessToast";
import { throwErrorToast } from "../components/toasts/ErrorToast";
import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/services/userService";
import { validEmail } from "@/utils/verification";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { throwWarningToast } from "@/components/toasts/WarningToast";
import { displayUserRoleName } from "@/utils/display";

export default function ProfilePage() {
  const [user, setUser] = useState(useAuth().user);
  const editProfileRef = useRef<HTMLSpanElement>(null);

  const navigate = useNavigate();

  const [profileInputData, setProfileInputData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [disabled, setDisabled] = useState(true);

  const highlightBackground = "bg-blue-300";

  const highlightEditProfile = () => {
    if (disabled && editProfileRef.current) {
      editProfileRef.current.classList.add(highlightBackground, "transition-colors");
      setTimeout(() => {
        editProfileRef.current?.classList.remove(highlightBackground);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-gray-50 py-10 px-4 sm:px-6">
      <div className="w-full max-w-screen-lg bg-white rounded-xl shadow p-6 sm:p-10 md:p-12">
        <div className="flex flex-col space-y-6">
          <span className="font-bold text-lg mb-0">
            {user?.firstName + " " + user?.lastName}
          </span>
          <span className="font-bold text-md mb-5 text-gray-500">
            {user?.role &&
              "Permission Level: " + displayUserRoleName(user?.role)
            }
          </span>
          <div className="flex flex-col mb-7">
            <hr className="bg-gray-500 mb-2"></hr>
            <div className="flex flex-row justify-between">
              <span className="font-semibold text-md text-gray-500">
                Basic Information
              </span>
              <span
                ref={editProfileRef}
                className={`font-md text-md text-gray-500 underline cursor-pointer transition-colors`}
                onClick={() => setDisabled(!disabled)}
              >
                Edit Profile
              </span>
            </div>
            <hr className="bg-gray-500 mt-2"></hr>
          </div>
          <div className="flex flex-col gap-15">
            <div onClick={disabled ? highlightEditProfile : undefined}>
              <OneLineInput
                question="First Name"
                value={profileInputData.firstName}
                disabled={disabled}
                isRequired={true}
                onChange={(value) =>
                  setProfileInputData((prev) => ({ ...prev, firstName: value }))
                }
              />
            </div>
            <div onClick={disabled ? highlightEditProfile : undefined}>
              <OneLineInput
                question="Last Name"
                value={profileInputData.lastName}
                disabled={disabled}
                isRequired={true}
                onChange={(value) =>
                  setProfileInputData((prev) => ({ ...prev, lastName: value }))
                }
              />
            </div>
            <div onClick={disabled ? highlightEditProfile : undefined}>
              <OneLineInput
                question="Email"
                value={profileInputData.email}
                disabled={disabled}
                isRequired={true}
                onChange={(value) =>
                  setProfileInputData((prev) => ({ ...prev, email: value }))
                }
              />
            </div>

            <div className="flex mt-4">
              <Button
                className="self-start"
                variant="outline"
                onClick={async () => {
                  if (user?.email) {
                    await sendPasswordResetEmail(auth, user.email);
                    throwSuccessToast(
                      "Password reset link sent to " + user.email,
                    );
                  } else {
                    throwErrorToast("No email found for password reset.");
                  }
                }}
              >
                Reset Password
              </Button>

              <div className="flex-grow" />

              <Button
                disabled={disabled}
                onClick={async () => {
                  if (
                    !profileInputData.firstName.trim() ||
                    !profileInputData.lastName.trim() ||
                    !profileInputData.email.trim()
                  ) {
                    throwErrorToast(
                      "Please fill in all required fields before saving.",
                    );
                    return;
                  }

                  if (!validEmail(profileInputData.email)) {
                    throwErrorToast(
                      "Invalid Email. Please ensure your email ends with @terpmail.umd.edu or @umd.edu",
                    );
                    return;
                  }

                  setDisabled(true)
                  throwWarningToast("Attempting to update profile...")

                  try {
                    const emailChanged = profileInputData.email !== user?.email;

                    const updatedUser = await updateUser(
                      profileInputData.email,
                      profileInputData.firstName,
                      profileInputData.lastName,
                    );

                    setUser(updatedUser);

                    throwSuccessToast("Profile email updated successfully!");

                    if (emailChanged && auth.currentUser) {
                      await auth.currentUser?.getIdToken(true);
                      await sendEmailVerification(auth.currentUser);
                      await auth.currentUser.reload();

                      navigate("/verify");
                      return;
                    }
                  } catch (error) {
                    throwErrorToast(
                      "Failed to update profile. Please try again.",
                    );
                    console.error(error);
                  }
                }}
              >
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

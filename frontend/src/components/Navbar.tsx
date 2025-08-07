import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import { PermissionRole } from "@/types/types";
import NavProfile from "./NavProfile";
import { HomeIcon } from "lucide-react";

function Navbar({ className }: { className?: string }) {
  const { isLoading, isAuthed, user } = useAuth();

  return (
    <div
      className={twMerge(
        "z-50 flex flex-row w-full py-4 px-8 justify-center items-center bg-lightgray/70 backdrop-blur-sm h-16",
        className,
      )}
    >
      <div className="flex items-center flex-row h-full max-w-5xl w-full">
        <div className="flex gap-2 items-center">
          <NavLink className="hidden sm:block" to="/">
            <img
              className="w-52"
              src="/h4i_umd_logo.png"
              alt="hack4impact-UMD"
            />
          </NavLink>
          <span className="text-blue font-bold text-lg sm:hidden block">
            H4I-UMD
          </span>
          {user?.role && user.role != PermissionRole.Applicant && (
            <>
              <span className="font-light sm:mb-1">
                |{" "}
                {user.role == PermissionRole.Reviewer
                  ? "Reviewer"
                  : user.role == PermissionRole.SuperReviewer
                    ? "Super Reviewer"
                    : "Applicant"}
              </span>
            </>
          )}
        </div>
        <div className="ml-auto flex flex-row items-center">
          <NavLink to="/">
            <HomeIcon className="w-8 h-8 text-black mr-3 cursor-pointer hover:bg-darkgray/5 rounded-md p-1 transition-colors" />
          </NavLink>
          {!isLoading && isAuthed && user && (
            <NavProfile user={user} className="hover:bg-darkgray/5" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

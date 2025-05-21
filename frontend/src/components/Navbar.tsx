import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { twMerge } from "tailwind-merge";

function Navbar({ className }: { className?: string }) {
    const { isLoading, isAuthed, logout } = useAuth()

    function handleSignout() {
        logout()
    }

    return (
        <div className={twMerge("z-50 flex flex-row w-full py-4 px-8 justify-center items-center bg-lightgray/70 backdrop-blur-sm h-16", className)}>
            <div className="flex flex-row h-full max-w-5xl w-full">
                <div className="flex flex-2 items-center">
                    <NavLink to="/">
                        <img className="w-52" src="/h4i_umd_logo.png" alt="hack4impact-UMD" />
                    </NavLink>
                </div>
                {!isLoading && isAuthed && (
                    <div className="font-['Rubik'] text-right text-m font-extralight cursor-pointer flex flex-col justify-center ">
                        <p className="hover:underline" onClick={() => handleSignout()}>
                            Sign Out
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Navbar;

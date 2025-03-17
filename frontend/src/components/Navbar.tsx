import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
    const { isLoading, isAuthed, logout } = useAuth()

    function handleSignout() {
        logout()
    }

    return (
        <div className="z-50 flex flex-row w-full py-4 px-8 justify-center items-center bg-lightgray h-20">
            <div className="flex flex-row h-full max-w-5xl w-full">
                <div className="flex flex-2 items-center">
                    <NavLink to="/">
                        <img className="w-36" src="/h4i_logo.png" alt="hack4impact-UMD" />
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

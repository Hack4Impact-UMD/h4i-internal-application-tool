import { useAuth } from "./providers/AuthProvider";

function Navbar() {
    const { isLoading, isAuthed, logout } = useAuth()

    function handleSignout() {
        logout()
    }

    return (
        <div className="z-50 flex flex-row w-full py-4 px-8 justify-start bg-lightgray h-20">
            <div className="flex flex-2 ml-16 items-center">
                <img className="w-36" src="/h4i_logo.png" alt="hack4impact-UMD" />
            </div>
            {!isLoading && isAuthed && (
                <div className="font-['Rubik'] text-right text-m font-extralight cursor-pointer flex flex-col justify-center pr-[7%]">
                    <p className="hover:underline" onClick={() => handleSignout()}>
                        Sign Out
                    </p>
                </div>
            )}
        </div>
    )
}

export default Navbar;

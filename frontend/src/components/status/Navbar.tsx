import { ReactNode } from 'react';
import { Link, useLocation, useResolvedPath } from 'react-router-dom';

interface NavbarProps {
    isSignedIn: boolean;
  }

function Navbar({ isSignedIn }: NavbarProps) {
    function handleSignout() {
        // TODO: Reset state and return to login page
        window.open("/", "_self");
    }

    return (
        <div className="z-50 flex flex-row w-full py-4 px-8 justify-start bg-gray h-20">
            <div className="flex flex-2 ml-16 items-center">
                <img className="w-48" src="/public/h4i_logo.png" alt="hack4impact-UMD" />
            </div>
            {isSignedIn && (
                <div className="font-['Rubik'] text-right text-xl font-medium cursor-pointer">
                <p className="hover:underline" onClick={() => handleSignout()}>
                    Sign Out
                </p>
            </div>
      )}
        </div>
    )
}

export default Navbar;

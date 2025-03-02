import { ReactNode } from 'react';
import { Link, useLocation, useResolvedPath } from 'react-router-dom';

function Navbar() {
    function handleSignout() {
        // TODO: Reset state and return to login page
        window.open("/", "_self");
    }

    return (
        <div className="z-50 flex flex-col w-full pt-4 px-4 justify-start bg-gradient-to-r from-lightblue to-teal">
            <div className="font-['Rubik'] text-right text-lg font-light cursor-pointer">
                <p className="hover:underline" onClick={() => handleSignout()}>
                    Sign Out
                </p>
            </div>

            <img className="w-1/4 min-w-40" src="/h4i_umd_logo.png" alt="hack4impact-UMD" />

            <div className="flex gap-4 items-center justify-center w-full">
                <NavLink id="dashboard-link" className="hover:bg-lightgray active:bg-white font-['Karla'] font-light flex w-1/5 min-w-40 h-14 items-center justify-center text-center text-3xl rounded-t-xl bg-gray text-black select-none transition" to="/application">Application</NavLink>
                <NavLink id="dashboard-link" className="hover:bg-lightgray active:bg-white font-['Karla'] font-light flex w-1/5 min-w-40 h-14 items-center justify-center text-center text-3xl rounded-t-xl bg-gray text-black select-none transition" to="/status">Status</NavLink>
            </div>
        </div>
    )
}

interface NavLinkProps {
    id: string;
    to: string;
    className: string;
    children: ReactNode
}

// A special link that includes whether it is currently active in its className
function NavLink({ to, children, className, ...props }: NavLinkProps) {
    const resolvedPath = useResolvedPath(to);
    const location = useLocation();
    const isActive = location.pathname.startsWith(resolvedPath.pathname);
    return (
        <Link className={className + (isActive ? " bg-white pointer-events-none" : "")} to={to} {...props}>{children}</Link>
    )
}

export default Navbar;

import { ReactNode } from 'react';
import { Link, useLocation, useResolvedPath } from 'react-router-dom';

function Navbar() {
    function handleSignout() {
        // TODO: Reset state and return to login page
        window.open("/", "_self");
    }

    return (
        <div className="navbar">
            <div className="sign-out-button">
                <p onClick={() => handleSignout()}>
                    Sign Out
                </p>
            </div>

            <img className="site-logo" src="/h4i_umd_logo.png" alt="hack4impact-UMD" />

            <div className="tab-container">
                <NavLink id="dashboard-link" to="/application">Application</NavLink>
                <NavLink id="dashboard-link" to="/status">Status</NavLink>
            </div>
        </div>
    )
}

interface NavLinkProps {
    id: string;
    to: string;
    children: ReactNode
}

// A special link that includes whether it is currently active in its className
function NavLink({ to, children, ...props }: NavLinkProps) {
    const resolvedPath = useResolvedPath(to);
    const location = useLocation();
    const isActive = location.pathname.startsWith(resolvedPath.pathname);
    return (
        <Link className={isActive ? "active" : ""} to={to} {...props}>{children}</Link>
    )
}

export default Navbar;

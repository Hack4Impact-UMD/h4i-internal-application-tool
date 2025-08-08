import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { displayUserRoleName } from "@/utils/display";
import { Github, Instagram, Linkedin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex flex-col flex-1 items-center justify-center gap-5">
        <img
          src="h4i-logo.png"
          alt="h4i logo"
          className="h-[105px] w-[105px] transition-transform duration-300 ease-in-out hover:scale-105 hover:animate-spin-slow"
        />
        <div className="flex flex-col items-center text-center justify-around">
          <h1 className="text-3xl font-bold">
            Hack4Impact-UMD Application Portal
          </h1>
          <h3 className="text-lg text-darkgray">
            {user ? "Welcome back!" : "Apply to be a Hack4Impact-UMD member!"}
          </h3>
        </div>
        <div>
          {user ? (
            <div className="flex flex-row gap-1">
              <Button onClick={() => navigate("/login")}>
                Enter {displayUserRoleName(user?.role)} Home
              </Button>
              <Button onClick={logout}>Log out</Button>
            </div>
          ) : (
            <div className="flex flex-row gap-1">
              <Button onClick={() => navigate("/signup")}>
                Create Account
              </Button>
              <Button onClick={() => navigate("/login")}>Log In</Button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-md">
        <div className="flex justify-center gap-5 text-gray-600">
          <Link to="https://www.instagram.com/hack4impactumd/" target="_blank">
            <Instagram />
          </Link>{" "}
          |
          <Link
            to="https://www.linkedin.com/company/hack4impact-umd"
            target="_blank"
          >
            <Linkedin />
          </Link>{" "}
          |
          <Link to="https://github.com/Hack4Impact-UMD" target="_blank">
            <Github />
          </Link>{" "}
          |
          <Link to="https://umd.hack4impact.org/" target="_blank">
            umd.hack4impact.org
          </Link>
        </div>
      </footer>
    </div>
  );
}

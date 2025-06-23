import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar className="fixed" />
      <div className="grow w-full pt-16">
        <Outlet />
      </div>
    </div>
  );
}

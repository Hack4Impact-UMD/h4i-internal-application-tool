import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return <div className="w-full h-full flex flex-col">
    <Navbar />
    <div className="grow w-full">
      <Outlet />
    </div>
  </div>
}

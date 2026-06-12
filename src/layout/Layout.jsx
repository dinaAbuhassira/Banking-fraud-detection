import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";

import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <Topbar />

        <Outlet />
      </div>
    </div>
  );
}
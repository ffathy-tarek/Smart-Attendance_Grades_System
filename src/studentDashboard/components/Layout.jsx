// src/studentDashboard/components/Layout.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <main className="w-full p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
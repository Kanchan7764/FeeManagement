import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import AdminSidebar from "../components/dashboard/AdminSidebar";
import Navbar from "../components/dashboard/Navbar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR FOR LARGE SCREENS */}
      <div className="hidden md:block w-64 fixed top-0 left-0 h-full bg-gray-800 text-white z-20">
        <AdminSidebar />
      </div>

      {/* SIDEBAR FOR MOBILE */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-30 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 md:hidden`}
      >
        <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* BACKDROP (mobile only) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
        />
      )}

      {/* MAIN SECTION */}
      <div className="flex-1 md:ml-64 flex flex-col bg-gray-100 text-gray-900">

        {/* NAVBAR */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto  sm:p-0">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

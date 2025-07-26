import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";


const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <SidebarAdmin/>

      {/* Main content area */}
      <div className="flex-1 p-6 lg:ml-64 mt-16 lg:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;

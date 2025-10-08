import React, { useState } from "react";
import StaffNavbar from "../../components/staff/StaffNavbar";
import StaffHeader from "../../components/staff/StaffHeader";
import { Outlet } from "react-router-dom";  
const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <StaffNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffHeader />
        <main >
        {/* 👇 Outlet thay cho children */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;

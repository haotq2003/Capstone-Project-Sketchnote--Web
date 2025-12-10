import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav";

import { AdminHeader } from "./AdminHeader";

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - fixed */}
      <AdminNav />

      {/* Main - scrollable */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

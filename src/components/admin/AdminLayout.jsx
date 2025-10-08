import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav";

import { AdminHeader } from "./AdminHeader";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminNav />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";

import DesignerNav from "./DesignerNav";
import { DesignerHeader } from "./DesignerHeader";

export function DesignerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DesignerNav />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <DesignerHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

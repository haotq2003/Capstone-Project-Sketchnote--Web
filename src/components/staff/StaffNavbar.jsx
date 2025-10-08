import React from "react";
import { LayoutDashboard, DollarSign, Headphones, BookOpen, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const StaffNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
   
    { path: "/staff/withdrawals", icon: DollarSign, label: "Withdrawals" },
    { path: "/staff/support", icon: Headphones, label: "Support" },
    { path: "/staff/courses", icon: BookOpen, label: "Courses" },
  ];

  return (
    <aside
      className={`${sidebarOpen ? "w-64" : "w-20"} bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all duration-300 flex flex-col shadow-xl`}
    >
      <div className="p-6 flex items-center justify-between border-b border-blue-500">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg">SketchNote</h1>
              <p className="text-xs text-blue-200">Staff Portal</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-blue-500 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-white hover:bg-purple-500"
                }`
              }
            >
              <Icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default StaffNavbar;

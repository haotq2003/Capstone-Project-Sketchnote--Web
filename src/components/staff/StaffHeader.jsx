import React, { useState } from "react";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StaffHeader = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Menu config
  const menuItems = [
    { icon: User, label: "Profile", path: "/staff/profile" },
    { icon: Settings, label: "Settings", path: "/staff/settings" },
    { icon: LogOut, label: "Logout", path: "/login", danger: true },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Staff Dashboard</h2>
        <p className="text-sm text-gray-500">Manage all staff activities</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[
                  "New withdrawal request",
                  "New support ticket",
                  "Course update completed",
                ].map((notif, i) => (
                  <div
                    key={i}
                    className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                  >
                    <p className="text-sm text-gray-700">{notif}</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@sketchnote.com</p>
              </div>
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      item.danger ? "text-red-600" : "text-gray-700"
                    } ${i === 2 ? "border-t border-gray-200" : ""}`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;

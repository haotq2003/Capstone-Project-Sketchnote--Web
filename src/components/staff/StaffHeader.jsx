import { Bell, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { decodeUserFromToken } from "../../util/authUtil";
import { authService } from "../../service/authService";

export default function StaffHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const user = decodeUserFromToken(token);

  const menuItems = [
    { icon: User, label: "Profile", path: "/staff/profile" },
    // { icon: Settings, label: "Settings", path: "/staff/settings" },
    {
      icon: LogOut,
      label: "Logout",
      action: async () => {
        await authService.logout();
        navigate("/login");
      },
      danger: true,
    },
  ];

  // Map routes to page titles
  const pageTitles = {
    '/staff/dashboard': 'Dashboard',
    '/staff/courses': 'Course Management',
    '/staff/resources': 'Resource Review',
    '/staff/accept-blog': 'Accept Blog',
    '/staff/profile': 'Profile',
    '/staff/withdrawals': 'Withdrawals',
    '/staff/resource-template': 'Resource Template',
  };

  // Get current page title
  const currentPageTitle = pageTitles[location.pathname] || 'Staff Portal';

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Page Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{currentPageTitle}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 border-l pl-4"
            >
              <img
                src="https://res.cloudinary.com/dturncvxv/image/upload/v1759910431/b5e15cec-6489-46e7-bd9e-596a24bd5225_wbpdjm.jpg"
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">{user?.name || "Staff"}</span>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <p className="font-semibold text-gray-800">{user?.name || "Staff Member"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "staff@sketchnote.com"}</p>
                </div>
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  const onClick = item.action || (() => navigate(item.path));
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setMenuOpen(false);
                        onClick();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${item.danger ? "text-red-600" : "text-gray-700"
                        } ${i === menuItems.length - 1 ? "border-t border-gray-200" : ""}`}
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
      </div>
    </header>
  );
}

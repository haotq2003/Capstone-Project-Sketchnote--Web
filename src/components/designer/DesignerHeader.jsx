import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Bell, User, Settings, LogOut } from "lucide-react";
import { decodeUserFromToken } from "../../util/authUtil";
import { authService } from "../../service/authService";

export function DesignerHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const user = decodeUserFromToken(token);

  const menuItems = [
    { label: "Profile", icon: User, onClick: () => navigate("/designer/profile") },
    { label: "Settings", icon: Settings, onClick: () => navigate("/designer/settings") },
    {
      label: "Logout",
      icon: LogOut,
      onClick: async () => {
        await authService.logout();
        navigate("/login");
      },
      danger: true
    },
  ];

  // Map routes to page titles
  const pageTitles = {
    '/designer/dashboard': 'Dashboard',
    '/designer/resources': 'My Resources',
    '/designer/courses': 'My Courses',
    '/designer/wallet': 'Wallet',
    '/designer/profile': 'Profile',
    '/designer/settings': 'Settings',
    '/designer/reports': 'Report',
    '/designer/notifications': 'Notifications',
  };

  // Get current page title
  const currentPageTitle = pageTitles[location.pathname] || 'Designer Portal';

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Page Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{currentPageTitle}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
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
              <span className="text-sm font-medium text-gray-700">{user?.name || "Designer"}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <p className="font-semibold text-gray-800">{user?.name || "Designer"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "designer@sketchnote.com"}</p>
                </div>
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setMenuOpen(false);
                        item.onClick();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${item.danger ? "text-red-600" : "text-gray-700"
                        } ${index === menuItems.length - 1 ? "border-t border-gray-200" : ""}`}
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

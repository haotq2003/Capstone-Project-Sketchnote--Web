import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Moon, Bell, Menu, User, Settings, LogOut } from "lucide-react";
import { decodeUserFromToken } from "../../util/authUtil";
import { authService } from "../../service/authService";

export function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const user = decodeUserFromToken(token);

  const menuItems = [
    { icon: User, label: "Profile", path: "/admin/profile" },
  
    { icon: LogOut, label: "Logout", action: async () => {
      await authService.logout();
      navigate("/login");
    }, danger: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search or type command..."
              className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Moon className="w-5 h-5 text-gray-500" />
          </button>

          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

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
              <span className="text-sm font-medium text-gray-700">{user?.name || "Admin"}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <p className="font-semibold text-gray-800">{user?.name || "Administrator"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "admin@sketchnote.com"}</p>
                </div>
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const onClick = item.action || (() => navigate(item.path));
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setMenuOpen(false);
                        onClick();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        item.danger ? "text-red-600" : "text-gray-700"
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

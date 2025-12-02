import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Box,
  HandCoins,
  BookA,
  FileText,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { authService } from "../../service/authService";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "User Manager", icon: User, path: "/admin/users" },
  { title: "Credit Packages", icon: FileText, path: "/admin/credit" },
  { title: "Subscription Packages", icon: Box, path: "/admin/subscriptions" },
  { title: "Revenue", icon: HandCoins, path: "/admin/revenue" },
  { title: "Chat", icon: BookA, path: "/admin/chat" },
];

export default function AdminNav() {
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="w-72 bg-white min-h-screen border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 ">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <div className="flex gap-0.5">
            <img src="https://res.cloudinary.com/dturncvxv/image/upload/v1759910431/b5e15cec-6489-46e7-bd9e-596a24bd5225_wbpdjm.jpg" alt="" />
          </div>
        </div>
        <span className="text-2xl font-bold" style={{ fontFamily: 'Pacifico, cursive', color: '#084F8C' }}>SketchNote</span>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-4 flex-1">
        <p className="text-xs font-semibold text-gray-400 px-3 mb-3 uppercase tracking-wider">
          Menu
        </p>
        <ul className="space-y-1 pl-4 whitespace-nowrap">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  navigate(item.path);
                  setActiveItem(index);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${activeItem === index
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 ${activeItem === index
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-600"
                      }`}
                  />
                  <span className="text-base font-medium">{item.title}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${activeItem === index ? "rotate-180" : ""
                      }`}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

    </div>
  );
}

import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Headphones,
  BookOpen,
  ScrollText,
  LogOut,
  Coins,
  Box,
} from "lucide-react";
import { authService } from "../../service/authService";

export default function StaffNavbar() {
  const navigate = useNavigate();
  const menuItems = [
    // { path: "/staff/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/staff/courses", icon: BookOpen, label: "Courses" },
    // { path: "/staff/support", icon: Headphones, label: "Support" },
   
    { path: "/staff/resources", icon: ScrollText, label: "Resources" },
    { path: "/staff/accept-blog", icon: ScrollText, label: "Accept Blog" },
    { path: "/staff/credit", icon: Coins, label: "Credit Packages" },
    { path: "/staff/subscriptions", icon: Box, label: "Subscription Packages" },
  ];

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-white to-gray-50/30 h-screen border-r border-gray-200 flex flex-col sticky top-0 overflow-y-auto shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-200 bg-white">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
          <img
            src="https://res.cloudinary.com/dturncvxv/image/upload/v1759910431/b5e15cec-6489-46e7-bd9e-596a24bd5225_wbpdjm.jpg"
            alt="logo"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <span
          className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Pacifico, cursive" }}
        >
          SketchNote
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        <p className="text-[10px] font-bold text-gray-500 px-2 mb-4 uppercase tracking-widest">
          Menu
        </p>
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm group relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 font-semibold shadow-sm"
                        : "text-gray-700 hover:bg-white hover:shadow-md"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full" />
                      )}
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                          isActive 
                            ? "text-blue-600 scale-110" 
                            : "text-gray-400 group-hover:text-blue-600 group-hover:scale-110"
                        }`}
                      />
                      <span className="transition-all duration-200">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto px-4 pb-6 pt-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm"></div>
    </aside>
  );
}

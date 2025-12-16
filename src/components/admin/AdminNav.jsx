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
  Wallet,
  ArrowRightLeft,
  ShoppingCart,
  Coins,
  Calendar,
  Settings,
} from "lucide-react";
import { authService } from "../../service/authService";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  // { title: "Revenue", icon: HandCoins, path: "/admin/revenue" },
  { title: "Chat", icon: BookA, path: "/admin/chat" },
  { title: "User Management", icon: User, path: "/admin/users" },
  {
    title: "Transactions Management",
    icon: ArrowRightLeft,
    hasSubmenu: true,
    submenu: [
      {
        title: "All Transactions",
        icon: ArrowRightLeft,
        path: "/admin/transactions",
      },
      {
        title: "Order Transactions",
        icon: ShoppingCart,
        path: "/admin/order-transactions",
      },
      {
        title: "Credit Transactions",
        icon: Coins,
        path: "/admin/credit-transactions",
      },
      {
        title: "Subscription Transactions",
        icon: Calendar,
        path: "/admin/subscription-transactions",
      },
    ],
  },
  {
    title: "Wallets Management",
    icon: Wallet,
    hasSubmenu: true,
    submenu: [
      { title: "All Wallets", icon: Wallet, path: "/admin/wallets" },
      {
        title: "Withdrawal Management",
        icon: HandCoins,
        path: "/admin/withdrawals",
      },
    ],
  },
];

export default function AdminNav() {
  const [activeItem, setActiveItem] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50/30 h-screen border-r border-gray-200 flex flex-col sticky top-0 overflow-y-auto shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-200 bg-white">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
          <div className="flex gap-0.5">
            <img
              src="https://res.cloudinary.com/dturncvxv/image/upload/v1759910431/b5e15cec-6489-46e7-bd9e-596a24bd5225_wbpdjm.jpg"
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
        <span
          className="text-lg"
          style={{
            fontFamily: "Pacifico, cursive",
            color: "#084f8c",
            fontSize: "1.5rem",
          }}
        >
          SketchNote
        </span>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-5 flex-1">
        <p className="text-[10px] font-bold text-gray-500 px-2 mb-4 uppercase tracking-widest">
          Menu
        </p>
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleSubmenu(index);
                  } else {
                    navigate(item.path);
                    setActiveItem(index);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm group relative overflow-hidden ${
                  activeItem === index
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                {activeItem === index && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full" />
                )}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                      activeItem === index
                        ? "text-blue-600 scale-110"
                        : "text-gray-400 group-hover:text-blue-600 group-hover:scale-110"
                    }`}
                  />
                  <span className="transition-all duration-200">
                    {item.title}
                  </span>
                </div>
                {item.hasSubmenu && (
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-all duration-200 flex-shrink-0 ${
                      expandedMenus[index] ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {item.hasSubmenu && expandedMenus[index] && (
                <ul className="mt-1.5 ml-4 space-y-1 border-l-2 border-blue-100 pl-3">
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <button
                        onClick={() => {
                          navigate(subItem.path);
                          setActiveItem(`${index}-${subIndex}`);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-xs font-medium group relative ${
                          activeItem === `${index}-${subIndex}`
                            ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 shadow-sm"
                            : "text-gray-600 hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        <subItem.icon
                          className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                            activeItem === `${index}-${subIndex}`
                              ? "text-blue-600 scale-110"
                              : "text-gray-400 group-hover:text-blue-600 group-hover:scale-105"
                          }`}
                        />
                        <span className="transition-all duration-200">
                          {subItem.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

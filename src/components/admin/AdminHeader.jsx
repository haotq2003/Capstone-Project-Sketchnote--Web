import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Bell, User, Settings, LogOut } from "lucide-react";
import { decodeUserFromToken } from "../../util/authUtil";
import { authService } from "../../service/authService";

export function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const user = decodeUserFromToken(token);

  const menuItems = [
    { icon: User, label: "Profile", path: "/admin/profile" },
    {
      icon: LogOut,
      label: "Logout",
      action: async () => {
        await authService.logout();
        navigate("/login");
      },
      danger: true
    },
  ];

  // Map routes to page titles
  const pageTitles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'User Management',
    '/admin/revenue': 'Revenue Analytics',
    '/admin/chat': 'Chat Support',
    '/admin/profile': 'Profile',
    '/admin': 'Dashboard',
    // '/admin/credit': 'Credit Management',
    // '/admin/subscriptions': 'Subscription Packages',
    '/admin/order-transactions': 'Order Transactions Management',
    '/admin/wallets': 'Wallet Management',
    '/admin/transactions': 'Transactions Management',
    '/admin/credit-transactions': 'Credit Transactions Management',
    '/admin/subscription-transactions': 'Subscription Transactions Management',
    '/admin/withdrawals': 'Withdrawals Management',
  };

  // Get current page title
  const currentPageTitle = pageTitles[location.pathname] || 'Admin Portal';

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Page Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{currentPageTitle}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* My Wallet Button */}
          <button
            onClick={() => navigate('/admin/my-wallet')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            <span className="text-sm font-medium text-blue-600">My Wallet</span>
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

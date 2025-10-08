import { NavLink } from "react-router-dom";
import { LayoutDashboard, DollarSign, Headphones, BookOpen } from "lucide-react";

export default function StaffNavbar() {
  const menuItems = [
    { path: "/staff/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/staff/courses", icon: BookOpen, label: "Courses" },
    { path: "/staff/support", icon: Headphones, label: "Support" },
    { path: "/staff/withdrawals", icon: DollarSign, label: "Withdrawals" },
  ];
 
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 ">
        <div className="w-10 h-10 rounded-lg  flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dturncvxv/image/upload/v1759910431/b5e15cec-6489-46e7-bd9e-596a24bd5225_wbpdjm.jpg"
            alt="logo"
            
          />
        </div>
        <span className="text-2xl font-bold text-gray-900">SketchNote</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <p className="text-xs font-semibold text-gray-400 px-3 mb-3 uppercase tracking-wider">
           Menu
        </p>
        <ul className="space-y-1 pl-4">
          {menuItems.map((item) => {
  const Icon = item.icon;
  return (
    <li key={item.path}>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `w-full  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            isActive
              ? "bg-indigo-50 text-indigo-600 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={22}
              className={isActive ? "text-indigo-600" : "text-gray-500"}
            />
            <span className="text-base font-medium">{item.label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
})}

        </ul>
      </nav>
    </aside>
  );
}

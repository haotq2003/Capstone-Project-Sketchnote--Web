import { Routes, Route, Navigate } from "react-router-dom";

import StaffLayout from "./components/staff/StaffLayout";
import CourseManagement from "./pages/staff/CourseManagement";
import CustomerSupport from "./pages/staff/CustomerSupport";
import WithdrawalManagement from "./pages/staff/WithdrawalManagement";
import Login from "./pages/auth/login";
import '@ant-design/v5-patch-for-react-19';
import { AdminLayout } from "./components/admin/AdminLayout";
import UserManagement from "./pages/admin/UserManagement";
import ManageUsers from "./pages/admin/UserManagement";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
   
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Staff routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route path="courses" element={<CourseManagement />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="withdrawals" element={<WithdrawalManagement />} />
      </Route>

       <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<ManageUsers />} />
      </Route>

       <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

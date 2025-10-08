import { Routes, Route, Navigate } from "react-router-dom";

import StaffLayout from "./components/staff/StaffLayout";
import CourseManagement from "./pages/staff/CourseManagement";
import CustomerSupport from "./pages/staff/CustomerSupport";
import WithdrawalManagement from "./pages/staff/WithdrawalManagement";
import Login from "./pages/auth/login";
import '@ant-design/v5-patch-for-react-19';

function App() {
  return (
    <Routes>
      {/* Khi chạy project -> chuyển hướng vào /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Staff routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route path="courses" element={<CourseManagement />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="withdrawals" element={<WithdrawalManagement />} />
      </Route>
    </Routes>
  );
}

export default App;

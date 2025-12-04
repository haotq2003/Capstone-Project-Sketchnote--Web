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
import AdminRevenueView from "./pages/admin/RevenueView";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfile from "./pages/admin/Profile";
import ManagerCredit from "./pages/admin/ManagerCredit";

import NotFound from "./pages/NotFound";

import DesignerResourceManager from "./pages/designer/ResourceManager";
import DesignerReportView from "./pages/designer/ReportView";
import { DesignerLayout } from "./components/designer/DesignerLayout";
import ResourceReviewPage from "./pages/staff/AcceptResource";
import AcceptBlog from "./pages/staff/AcceptBlog";
import StaffProfile from "./pages/staff/Profile";
import DesignerProfile from "./pages/designer/Profile";
import Chat from "./pages/admin/Chat";
import SketchNoteChat from "./pages/admin/chat2";
import SubscriptionPackages from "./pages/admin/SubscriptionPackages";
import WalletsManagement from "./pages/admin/WalletsManagement";
import TransactionsManagement from "./pages/admin/TransactionsManagement";
import UserTransactions from "./pages/admin/UserTransactions";
import SubscriptionTransactions from "./pages/admin/SubscriptionTransactions";
import CreditTransactions from "./pages/admin/CreditTransactions";
import OrderTransactions from "./pages/admin/OrderTransactions";


import AdminWithdrawalManagement from "./pages/admin/WithdrawalManagement";

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
        <Route path="resources" element={<ResourceReviewPage />} />
        <Route path="accept-blog" element={<AcceptBlog />} />
        <Route path="profile" element={<StaffProfile />} />
      </Route>

      {/* Designer (single role) */}
      <Route path="/designer" element={<DesignerLayout />}>
        <Route path="resource-manager" element={<DesignerResourceManager />} />
        <Route path="reports" element={<DesignerReportView />} />
        <Route path="profile" element={<DesignerProfile />} />
      </Route>



      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="revenue" element={<AdminRevenueView />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat2" element={<SketchNoteChat />} />
        <Route path="credit" element={<ManagerCredit />} />
        <Route path="subscriptions" element={<SubscriptionPackages />} />
        <Route path="wallets" element={<WalletsManagement />} />
        <Route path="transactions" element={<TransactionsManagement />} />
        <Route path="user-transactions" element={<UserTransactions />} />
        <Route path="subscription-transactions" element={<SubscriptionTransactions />} />
        <Route path="credit-transactions" element={<CreditTransactions />} />
        <Route path="credit-transactions" element={<CreditTransactions />} />
        <Route path="order-transactions" element={<OrderTransactions />} />
        <Route path="withdrawals" element={<AdminWithdrawalManagement />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

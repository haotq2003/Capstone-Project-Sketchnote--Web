import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

import StaffLayout from "./components/staff/StaffLayout";
import CourseManagement from "./pages/staff/CourseManagement";
import CustomerSupport from "./pages/staff/CustomerSupport";
import WithdrawalManagement from "./pages/staff/WithdrawalManagement";
import Login from "./pages/auth/login";
import "@ant-design/v5-patch-for-react-19";
import { AdminLayout } from "./components/admin/AdminLayout";
import UserManagement from "./pages/admin/UserManagement";
import ManageUsers from "./pages/admin/UserManagement";
import AdminRevenueView from "./pages/admin/RevenueView";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfile from "./pages/admin/Profile";
import ManagerCredit from "./pages/admin/ManagerCredit";
import ResourceTemplate from "./pages/staff/ResourceTemplate";

import NotFound from "./pages/NotFound";
import Welcome from "./pages/welcome/Welcome";
import HomeScreen from "./pages/home/HomeScreen";

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
import VerifyEmailSuccess from "./pages/VerifyEmailSuccess";
import VerifyEmailFailed from "./pages/VerifyEmailFailed";
import AdminWithdrawalManagement from "./pages/admin/WithdrawalManagement";
import AdminWallet from "./pages/admin/AdminWallet";

// Payment callback pages
import PaymentSuccess from "./pages/shared/PaymentSuccess";
import PaymentFailed from "./pages/shared/PaymentFailed";
import PaymentCallback from "./pages/shared/PaymentCallback";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/home" element={<HomeScreen />} />
      {/* Payment callback routes (public) */}
      <Route path="/payment-callback" element={<PaymentCallback />} />
      <Route path="/wallet-success" element={<PaymentSuccess />} />
      <Route path="/wallet-fail" element={<PaymentFailed />} />
      <Route path="verify-email-success" element={<VerifyEmailSuccess />} />
      <Route path="verify-email-failed" element={<VerifyEmailFailed />} />
      {/* Staff routes */}
      <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="courses" element={<CourseManagement />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="withdrawals" element={<WithdrawalManagement />} />
          <Route path="resources" element={<ResourceReviewPage />} />
          <Route path="accept-blog" element={<AcceptBlog />} />
          <Route path="credit" element={<ManagerCredit />} />
          <Route path="subscriptions" element={<SubscriptionPackages />} />
          <Route path="resource-template" element={<ResourceTemplate />} />
          <Route path="profile" element={<StaffProfile />} />
        </Route>
      </Route>

      {/* Designer (single role) */}
      <Route element={<ProtectedRoute allowedRoles={["DESIGNER"]} />}>
        <Route path="/designer" element={<DesignerLayout />}>
          <Route
            path="resource-manager"
            element={<DesignerResourceManager />}
          />
          <Route path="reports" element={<DesignerReportView />} />
          <Route path="profile" element={<DesignerProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="revenue" element={<AdminRevenueView />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat2" element={<SketchNoteChat />} />
          <Route path="wallets" element={<WalletsManagement />} />
          <Route path="transactions" element={<TransactionsManagement />} />
          <Route path="user-transactions" element={<UserTransactions />} />
          <Route
            path="subscription-transactions"
            element={<SubscriptionTransactions />}
          />
          <Route path="credit-transactions" element={<CreditTransactions />} />
          <Route path="credit-transactions" element={<CreditTransactions />} />
          <Route path="order-transactions" element={<OrderTransactions />} />
          <Route path="withdrawals" element={<AdminWithdrawalManagement />} />
          <Route path="my-wallet" element={<AdminWallet />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

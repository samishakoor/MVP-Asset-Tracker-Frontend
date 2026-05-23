import { Navigate, Route, Routes } from 'react-router-dom'
import {
  HOME_PAGE_LINK,
  LANDING_PAGE_LINK,
  LOGIN_PAGE_LINK,
  SIGNUP_PAGE_LINK,
  FORGOT_PASSWORD_PAGE_LINK,
  RESET_PASSWORD_PAGE_LINK,
  ADMIN_BASE_PATH,
  ADMIN_DASHBOARD_LINK,
  ADMIN_ASSETS_LINK,
  ADMIN_ASSETS_NEW_LINK,
  ADMIN_ASSET_DETAIL_LINK,
  ADMIN_ASSET_EDIT_LINK,
  ADMIN_ASSIGNMENTS_LINK,
  ADMIN_TICKETS_LINK,
  EMPLOYEE_DASHBOARD_PATH,
  EMPLOYEE_ASSIGNMENTS_LINK,
  EMPLOYEE_ASSET_DETAIL_LINK,
  EMPLOYEE_HISTORY_LINK,
  NOT_FOUND,
} from './constants/routes.js'
import { UserRole } from './constants/auth.js'
import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import EmployeeLayout from './layouts/EmployeeLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AssetsListPage from './pages/AssetsListPage.jsx'
import AddAssetPage from './pages/AddAssetPage.jsx'
import EditAssetPage from './pages/EditAssetPage.jsx'
import AssetDetailPage from './pages/AssetDetailPage.jsx'
import AssignmentsPage from './pages/AssignmentsPage.jsx'
import TicketsListPage from './pages/TicketsListPage.jsx'
import EmployeeDashboardPage from './pages/EmployeeDashboardPage.jsx'
import EmployeeAssignmentsPage from './pages/EmployeeAssignmentsPage.jsx'
import EmployeeAssetDetailPage from './pages/EmployeeAssetDetailPage.jsx'
import EmployeeHistoryPage from './pages/EmployeeHistoryPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export const AppRouter = () => (
  <Routes>
    {/* Auth — login and signup for admins and employees */}
    <Route element={<AuthLayout />}>
      <Route path={LOGIN_PAGE_LINK} element={<LoginPage />} />
      <Route path={SIGNUP_PAGE_LINK} element={<SignupPage />} />
      {/* Forgot password — request a reset link by email */}
      <Route path={FORGOT_PASSWORD_PAGE_LINK} element={<ForgotPasswordPage />} />
      {/* Reset password — set a new password from email link token */}
      <Route path={RESET_PASSWORD_PAGE_LINK} element={<ResetPasswordPage />} />
    </Route>

    {/* Admin — inventory and support oversight (admin role only) */}
    <Route
      path={ADMIN_BASE_PATH}
      element={
        <ProtectedRoute allowedRole={UserRole.ADMIN}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to={ADMIN_DASHBOARD_LINK} replace />} />
      {/* Dashboard — admin overview */}
      <Route path={ADMIN_DASHBOARD_LINK} element={<AdminDashboardPage />} />
      {/* Inventory — list company assets */}
      <Route path={ADMIN_ASSETS_LINK} element={<AssetsListPage />} />
      {/* Register asset — add new hardware to inventory */}
      <Route path={ADMIN_ASSETS_NEW_LINK} element={<AddAssetPage />} />
      {/* Edit asset — update existing asset details */}
      <Route path={ADMIN_ASSET_EDIT_LINK} element={<EditAssetPage />} />
      {/* Asset detail — full history and status updates */}
      <Route path={ADMIN_ASSET_DETAIL_LINK} element={<AssetDetailPage />} />
      {/* Assignments — assign assets to employees and manage returns */}
      <Route path={ADMIN_ASSIGNMENTS_LINK} element={<AssignmentsPage />} />
      {/* Support tickets — admin reviews employee-reported issues */}
      <Route path={ADMIN_TICKETS_LINK} element={<TicketsListPage />} />
    </Route>

    {/* Employee — assigned assets and support requests (employee role only) */}
    <Route
      path={EMPLOYEE_DASHBOARD_PATH}
      element={
        <ProtectedRoute allowedRole={UserRole.EMPLOYEE}>
          <EmployeeLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<EmployeeDashboardPage />} />
      {/* My assignments — view and acknowledge assigned assets */}
      <Route path={EMPLOYEE_ASSIGNMENTS_LINK} element={<EmployeeAssignmentsPage />} />
      {/* Asset detail — employee views asset info and reports an issue */}
      <Route path={EMPLOYEE_ASSET_DETAIL_LINK} element={<EmployeeAssetDetailPage />} />
      {/* History — read-only list of previously returned assets */}
      <Route path={EMPLOYEE_HISTORY_LINK} element={<EmployeeHistoryPage />} />
    </Route>

    {/* Main layout — public app shell with header and nested pages */}
    <Route path={LANDING_PAGE_LINK} element={<MainLayout />}>
      <Route index element={<Navigate to={HOME_PAGE_LINK} replace />} />
      <Route path={HOME_PAGE_LINK} element={<HomePage />} />
    </Route>

    {/* Catch-all — 404 page for unknown paths */}
    <Route path={NOT_FOUND} element={<NotFoundPage />} />
  </Routes>
)

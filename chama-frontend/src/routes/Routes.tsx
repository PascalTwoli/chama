import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layout/Admin-layout";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import Softloans from "../components/softloans";
import Meetings from "../components/meetings";
import Shares from "../components/shares";
import Notifications from "../components/notifications";
import Mpesa from "../components/mpesa";
import Settings from "../components/settings/settings";
import AccountSettings from "../components/settings/account-settings";
import NavbarOnlyLayout from "../layout/navbar-only-layout";
import CreateChama from "../components/create-chama";
import ChamaListView from "../components/chama-list-view";
import AdminDashboard from "../pages/AdminDashboard";
import { ChamaUserType } from "../components/user-role";
import { UserType } from "../data/user-role";
import MemberLayout from "../layout/Member-layout";
import MemberDashboard from "../pages/MemberDashboard";

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRole: 'admin' | 'member';
}

const AppRoutes = () => {
  // Function to check if user should be redirected to role selection
  const shouldRedirectToRoleSelection = () => {
    const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
    const hasRole = localStorage.getItem('userType');
    return isFirstLogin || !hasRole;
  };

  // Function to get default route based on user type
  const getDefaultRoute = () => {
    const authToken = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');
    const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';

    if (!authToken) return '/signin';
    if (isFirstLogin || !userType) return '/chose-user';
    if (userType === 'admin') return '/admin/chamas/1';
    return '/member/chamas/1';
  };

  // Protected route component
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
    const userType = localStorage.getItem('userType');
    const authToken = localStorage.getItem('authToken');
    const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';

    if (!authToken) {
      return <Navigate to="/signin" replace />;
    }

    if (isFirstLogin || !userType) {
      return <Navigate to="/chose-user" replace />;
    }

    if (allowedRole && userType !== allowedRole) {
      // Redirect to the appropriate dashboard based on actual role
      return <Navigate to={userType === 'admin' ? '/admin/chamas/1' : '/member/chamas/1'} replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chose-user" element={<ChamaUserType role={UserType.MEMBER} />} />

        {/* Admin routes */}
        <Route path="/create-chama" element={
          <ProtectedRoute allowedRole="admin">
            <NavbarOnlyLayout children={<CreateChama />} />
          </ProtectedRoute>
        } />

        <Route path="/admin/chamas/:chamaId/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="softloans" element={<Softloans />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="shares" element={<Shares />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="mpesa" element={<Mpesa />} />
          <Route path="chama_settings" element={<Settings />} />
          <Route path="account_settings" element={<AccountSettings />} />
        </Route>

        {/* Member routes */}
        <Route path="/chama-list-view" element={
          <ProtectedRoute allowedRole="member">
            <NavbarOnlyLayout children={<ChamaListView />} />
          </ProtectedRoute>
        } />

        <Route path="/member/chamas/:chamaId/*" element={
          <ProtectedRoute allowedRole="member">
            <MemberLayout />
          </ProtectedRoute>
        }>
          <Route index element= {<MemberDashboard/>} />
          <Route path="softloans" element={<Softloans />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="shares" element={<Shares />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="mpesa" element={<Mpesa />} />
          <Route path="chama_settings" element={<Settings />} />
          <Route path="account_settings" element={<AccountSettings />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
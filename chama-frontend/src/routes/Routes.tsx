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
import { ChamaUserType } from "../components/user-type";
import { UserType } from "../data/user-type";
import MemberLayout from "../layout/Member-layout";
import MemberDashboard from "../pages/MemberDashboard";
import AuthService from "../services/auth/signup-service";

interface ProtectedRouteProps {
	children: React.ReactElement;
	allowedRole: "admin" | "member";
}

const AppRoutes = () => {
	/**
	 * Function to check if user should be redirected to role selection
	 * @returns True if user should be redirected to role selection
	 */
	const shouldRedirectToRoleSelection = (): boolean => {
		const status = AuthService.checkOnboardingStatus();
		return status.needsUserType;
	};

	/**
	 * Function to get default route based on user type and onboarding status
	 * @returns The path to redirect to
	 */
	const getDefaultRoute = (): string => {
		return AuthService.getRedirectPath();
	};

	/**
	 * Protected route component - only allows access to users with specified role
	 */
	const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
		children,
		allowedRole,
	}) => {
		// Use the AuthService to check authentication and user type
		const authToken = localStorage.getItem("authToken");
		if (!authToken) {
			return <Navigate to="/signin" replace />;
		}

		// Get full onboarding status
		const status = AuthService.checkOnboardingStatus();
		
		// If user needs to select a type, redirect to user type selection
		if (status.needsUserType) {
			return <Navigate to="/chose-user" replace />;
		}

		// If user doesn't have the allowed role, redirect based on their actual role
		const normalizedUserType = AuthService.normalizeUserType(status.userType);
		const normalizedAllowedRole = AuthService.normalizeUserType(allowedRole);
		
		if (normalizedUserType !== normalizedAllowedRole) {
			// Get the appropriate redirect path based on user's status
			return <Navigate to={AuthService.getRedirectPath()} replace />;
		}

		// User has the correct role, render the children
		return children;
	};

	return (
		<BrowserRouter>
			<Routes>
				{/* Default redirect */}
				<Route
					path="/"
					element={<Navigate to={getDefaultRoute()} replace />}
				/>

				{/* Public routes */}
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
				<Route
					path="/chose-user"
					element={<ChamaUserType type={UserType.MEMBER} />}
				/>

				{/* Admin routes */}
				<Route
					path="/create-chama"
					element={
						<ProtectedRoute allowedRole="admin">
							<NavbarOnlyLayout children={<CreateChama />} />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/admin/chamas/:chamaId/*"
					element={
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
				<Route
					path="/chama-list-view"
					element={
						<ProtectedRoute allowedRole="member">
							<NavbarOnlyLayout children={<ChamaListView />} />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/member/chamas/:chamaId/*"
					element={
						<ProtectedRoute allowedRole="member">
							<MemberLayout />
						</ProtectedRoute>
					}>
					<Route index element={<MemberDashboard />} />
					<Route path="softloans" element={<Softloans />} />
					<Route path="meetings" element={<Meetings />} />
					<Route path="shares" element={<Shares />} />
					<Route path="notifications" element={<Notifications />} />
					<Route path="mpesa" element={<Mpesa />} />
					<Route path="chama_settings" element={<Settings />} />
					<Route path="account_settings" element={<AccountSettings />} />
				</Route>

				{/* Catch all route */}
				<Route
					path="*"
					element={<Navigate to={getDefaultRoute()} replace />}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;

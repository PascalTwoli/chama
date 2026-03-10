import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layout/Admin-layout';
import SignIn from '../pages/signin';
import SignUp from '../pages/signup';
import Landing from '../pages/Landing';
import Softloans from '../components/softloans';
import Meetings from '../components/meetings';
import Shares from '../components/shares';
// import Notifications from '../components/notifications';
import Disbursements from '../components/disbursements';
// import Settings from '../components/settings/settings';
import AccountSettings from '../components/settings/account-settings';
import NavbarOnlyLayout from '../layout/navbar-only-layout';
import CreateChama from '../components/create-chama';
import AdminDashboard from '../pages/AdminDashboard';
import MemberLayout from '../layout/Member-layout';
import MemberDashboard from '../pages/MemberDashboard';
import Membership from '../components/membership';
import InviteLink from '../components/InviteLink';
import InviteMembers from '../components/member-invitation';
import JoinRequests from '../components/join-requests';
import JoinChama from '../components/JoinChama';
import ChamaChoice from '../pages/onboarding/ChamaChoice';
import { ChamaMembershipProvider } from '../context/ChamaMembershipContext';
import AuthGuard from '../components/guards/AuthGuard';
import OnboardingGuard from '../components/guards/OnboardingGuard';
import DashboardGuard from '../components/guards/DashboardGuard';
import ContributionsPage from '../pages/ContributionsPage';
import ExpensesPage from '../pages/ExpensesPage';
import LoansPage from '../pages/LoansPage';
import MembersPage from '../pages/MembersPage';
import RolesAndPermissionsPage from '../pages/RolesAndPermissionsPage';
import ReportsPage from '../pages/ReportsPage';
import ActivityLogPage from '../pages/ActivityLogPage';
import CommunicationPage from '../pages/CommunicationPage';
import MeetingsPage from '../pages/MeetingsPage';
import SettingsPage from '../pages/SettingsPage';
import NotificationsPage from '../pages/NotificationsPage';
import RecordContribution from '../pages/RecordContributionPage';
import ScheduleMeetingPage from '../pages/ScheduleMeetingPage';

/**
 * AppRoutes - Main routing component for ChamaPlus
 *
 * Route Structure:
 * - / : Public landing page
 * - /auth/signin, /auth/signup : Authentication pages
 * - /signin, /signup : Legacy auth routes (redirect to /auth/*)
 * - /onboarding/chama-choice : For users without chamas
 * - /onboarding/create-chama : Create new chama flow
 * - /admin/chamas/:chamaId/* : Admin dashboard (requires ADMIN role)
 * - /member/chamas/:chamaId/* : Member dashboard (requires MEMBER role)
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ChamaMembershipProvider>
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}

          {/* Landing page - public */}
          <Route path='/' element={<Landing />} />

          {/* Auth routes - public */}
          <Route path='/auth/signin' element={<SignIn />} />
          <Route path='/auth/signup' element={<SignUp />} />

          {/* Legacy auth routes - redirect to new paths */}
          <Route
            path='/signin'
            element={<Navigate to='/auth/signin' replace />}
          />
          <Route
            path='/signup'
            element={<Navigate to='/auth/signup' replace />}
          />

          {/* ==================== ONBOARDING ROUTES ==================== */}

          {/* Chama choice - for authenticated users without chamas */}
          <Route
            path='/onboarding/chama-choice'
            element={
              <OnboardingGuard>
                <ChamaChoice />
              </OnboardingGuard>
            }
          />

          {/* Create chama flow - for authenticated users */}
          <Route
            path='/onboarding/create-chama'
            element={
              <AuthGuard>
                <NavbarOnlyLayout>
                  <CreateChama />
                </NavbarOnlyLayout>
              </AuthGuard>
            }
          />

          {/* Join Chama via Invite Link - Public/Hybrid */}
          <Route path='/join-chama/:token' element={<JoinChama />} />

          {/* Legacy create chama route */}
          <Route
            path='/create-chama'
            element={<Navigate to='/onboarding/create-chama' replace />}
          />

          {/* ==================== ADMIN ROUTES ==================== */}

          {/* Admin dashboard and sub-routes */}
          <Route
            path='/admin/chamas/:chamaId/*'
            element={
              <DashboardGuard requiredRole='ADMIN'>
                <AdminLayout />
              </DashboardGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path='membership' element={<Membership />} />
            <Route path='softloans' element={<Softloans />} />

            <Route path='meetings' element={<MeetingsPage />} />
            <Route path='meetings/schedule' element={<ScheduleMeetingPage />} />
            <Route path='shares' element={<Shares />} />
            <Route path='communication' element={<CommunicationPage />} />

            <Route path='notifications' element={<NotificationsPage />} />
            <Route path='disbursements' element={<Disbursements />} />
            <Route path='settings' element={<SettingsPage />} />
            <Route path='account-settings' element={<AccountSettings />} />
            <Route
              path='invite-link'
              element={<InviteLink chamaId='' chamaName='' />}
            />
            <Route path='members/invite-member' element={<InviteMembers />} />
            <Route path='members/join-requests' element={<JoinRequests />} />
            <Route path='contributions' element={<ContributionsPage />} />
            <Route
              path='contributions/record-contribution'
              element={<RecordContribution />}
            />
            <Route path='expenses' element={<ExpensesPage />} />
            <Route path='loans' element={<LoansPage />} />
            <Route path='members' element={<MembersPage />} />
            <Route path='roles' element={<RolesAndPermissionsPage />} />
            <Route path='reports' element={<ReportsPage />} />
            <Route path='activity-log' element={<ActivityLogPage />} />
          </Route>

          {/* Legacy admin dashboard route */}
          <Route
            path='/admin/dashboard'
            element={<Navigate to='/onboarding/chama-choice' replace />}
          />

          {/* ==================== MEMBER ROUTES ==================== */}

          {/* Member dashboard and sub-routes */}
          <Route
            path='/member/chamas/:chamaId/*'
            element={
              <DashboardGuard requiredRole='MEMBER'>
                <MemberLayout />
              </DashboardGuard>
            }
          >
            <Route index element={<MemberDashboard />} />
            <Route path='softloans' element={<Softloans />} />
            <Route path='meetings' element={<Meetings />} />
            <Route path='shares' element={<Shares />} />
            <Route path='notifications' element={<NotificationsPage />} />
            <Route path='disbursements' element={<Disbursements />} />
            <Route path='chama_settings' element={<SettingsPage />} />
            <Route path='account_settings' element={<AccountSettings />} />
          </Route>

          {/* Legacy member dashboard route */}
          <Route
            path='/member/dashboard'
            element={<Navigate to='/onboarding/chama-choice' replace />}
          />

          {/* ==================== CATCH-ALL ROUTE ==================== */}

          {/* Redirect unknown routes to landing */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </ChamaMembershipProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;

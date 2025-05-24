import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
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

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to some chama */}
        <Route path="/" element={<Navigate to="/chamas/1" replace />} />

        <Route path="/Signin" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/chamas/:chamaId/*" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="softloans" element={<Softloans />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="shares" element={<Shares />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="mpesa" element={<Mpesa />} />
          <Route path="chama_settings" element={<Settings />} />
          <Route path="account_settings" element={<AccountSettings />} />
        </Route>
        <Route element={<NavbarOnlyLayout />}>
          <Route path="/create-chama" element={<CreateChama />} />
          <Route path="chama-list-view" element={<ChamaListView />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
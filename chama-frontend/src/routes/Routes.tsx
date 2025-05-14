import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../pages/Dashboard";
import Signin from "../pages/signin";
import Signup from "../pages/signup";
import Softloans from "../components/softloans";
import Meetings from "../components/meetings";
import Shares from "../components/shares";
import Notifications from "../components/notifications";
import Mpesa from "../components/mpesa";
import Settings from "../components/settings/settings";
import AccountSettings from "../components/settings/account-settings";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="softloans" element={<Softloans/>}/>
          <Route path="meetings" element={<Meetings/>}/>
          <Route path="shares" element={<Shares/>}/>
          <Route path="notifications" element={<Notifications/>}/>
          <Route path="mpesa" element={<Mpesa/>}/>
          <Route path="chama_settings" element={<Settings/>}/>
          <Route path="account_settings" element={<AccountSettings/>}/>
          {/* <Route path="chamas" element={<ChamaList />} />
          <Route path="chamas/:id" element={<ChamaDetails />} /> */}
        </Route>      
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
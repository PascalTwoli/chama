import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../pages/Dashboard";
import Signin from "../pages/signin";
import Signup from "../pages/signup";
import Softloans from "../compnents/softloans";
import Meetings from "../compnents/meetings";
import Shares from "../compnents/shares";
import Notifications from "../compnents/notifications";
import Mpesa from "../compnents/mpesa";
import Settings from "../compnents/settings";


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
          <Route path="settings" element={<Settings/>}/>
          {/* <Route path="chamas" element={<ChamaList />} />
          <Route path="chamas/:id" element={<ChamaDetails />} /> */}
        </Route>      
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
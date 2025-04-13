import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../pages/Dashboard";
import Signin from "../pages/signin";
import Signup from "../pages/signup";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path="chamas" element={<ChamaList />} />
          <Route path="chamas/:id" element={<ChamaDetails />} /> */}
        </Route>      
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
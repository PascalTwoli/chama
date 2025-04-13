import { Outlet } from "react-router-dom";
import Navbar from "../compnents/Navbar";
import Sidebar from "../compnents/Sidebar";

const Layout = () => {

        return (
          <div className="bg-gray-800 text-white">
            <Navbar />
            <div className="flex h-screen main-section">
              <Sidebar /> 
              <div className="flex-1 flex flex-col">
                <main className="p-6">
                  <Outlet />
                </main>
              </div>
            </div>
          </div>

        );
}

export default Layout;
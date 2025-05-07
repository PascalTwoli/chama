import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {

        return (
          <div className="bg-gray-800 layout text-white h-screen">
            <Navbar />
            <div className="flex main-section  bg-[#1f2937] h-screen">
              <Sidebar /> 
              <div className="flex-1 flex  ml-3 rounded-xl"> {/* bg-gray-700 */}
                <main className="p-6 h-full w-full">
                  <Outlet />
                </main>
              </div>
            </div>
          </div>

        );
}

export default Layout;
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {

        return (
          <div className="bg-[#19222C] layout text-white">
            <Navbar />
            <div className="flex main-section"> {/**bg-[#1f2937] */}
              <Sidebar /> 
              <div className="flex-1 flex rounded-xl ml-1 overflow-auto"> {/* bg-gray-700 */}
                <main className="p-4 w-full">
                  <Outlet />
                </main>
              </div>
            </div>
          </div>

        );
}

export default Layout;
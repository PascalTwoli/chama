import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {

        return (
          <div className="bg-[#19222C] layout text-white">
            <Navbar />
            <div className="flex main-section"> {/**bg-[#1f2937] */}
              <Sidebar /> 
              <div className="flex-1 flex  ml-3 rounded-xl h-full bg-[#242E3B] mt-2 ml-2 "> {/* bg-gray-700 */}
                <main className="p-6 h-full w-full">
                  <Outlet />
                </main>
              </div>
            </div>
          </div>

        );
}

export default Layout;
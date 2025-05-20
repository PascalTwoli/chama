
import { Outlet } from "react-router-dom";

export default function NavbarOnlyLayout() {
  return (
    <div className="flex flex-col min-h-screen">
        <div className="navbar flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
            <div className="flex items-center gap-x-6">
                <span>my chama app</span>
            </div>
            <div className="flex gap-x-4 items-center">
                <i className="pi pi-bell" />
                <div  className="flex items-center gap-x-2">
                <span>Agustine</span>
                <i className="pi pi-chevron-down" />
                </div>
            </div>
        </div>
      <main className="flex-1 p-4">{/* no Sidebar */}<Outlet /></main>
    </div>
  );
}
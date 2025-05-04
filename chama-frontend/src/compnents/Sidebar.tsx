import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar () {
   const[isCollapsed, setIsCollapsed] = useState(false)


   return (
      <div className={`flex flex-col justify-between sidebar h-full bg-[#1f2937] text-white ${isCollapsed? 'w-fit p-2': 'w-fit pl-6 pr-6'} transition-all duration-500 ease-in-out`}>

         <div 
            className={``}>
            {/* toggle button */}
            <div className="sidebar-toggle-btn hover:bg-gray-600 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
               <button 
                  className="text-gray-400 hover:text-white">
                  <i className={`bi ${isCollapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left'}`}></i>
               </button>
               
            </div>
            <div className="">
               {/* header */}
               <div className={`sidebar-header flex items-center ${!isCollapsed ? 'pl-2 gap-2' : ''}`}>
                  <div className="chama-profile-image-div" style={{backgroundImage: "url('/assets/chamaprofileimage.png')", backgroundSize: "cover"}}>
                     <div className="chama-profile-overlay">
                     </div>
                  </div>
                  {!isCollapsed &&                
                  <div className={`flex flex-col text-center `}>
                     <p className="text-gray-400">Chama name</p>
                     <h3 className="font-bold">Twoli contribution  group</h3>
                  </div>}
               </div>

               {/* nav links */}
               <div className={`sidebar-nav flex flex-col gap-y-2 pt-7 pb-7 text-gray-400 font-bold mb-6 ${!isCollapsed ? 'pl-2' : ''}`}>
                  <h4 className={`flex ${isCollapsed ? 'justify-center' : ''}`}>Main</h4>

                  {[
                     ['bi-people-fill', 'Membership', '/'],
                     ['bi-newspaper', 'Soft loans', '/softloans'],
                     ['bi-house-check', 'Meetings', '/meetings'],
                     ['bi-graph-up', 'Shares', '/shares'],
                     ['bi-bell', 'Notifications', '/notifications'],
                     ['bi-diagram-2', 'Mpesa', '/mpesa'],
                  ].map(([icon, label, path]) => (
                     <NavLink
                        key={label}
                        to={path}
                        className={({ isActive }) =>
                        `flex items-center gap-x-4 py-3 px-2 rounded transition-all duration-300 hover:bg-gray-700 ${
                           isCollapsed ? 'justify-center' : ''
                           } ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400'}`
                        }>
                        <i className={`bi ${icon} sidebar-icon text-xl text-gray-300`}></i>
                        {!isCollapsed && <p className="pt-1">{label}</p>}
                     </NavLink>
                  ))}
               </div>
               
               {/* Settings */}
               <div className={` ${isCollapsed ? '' : 'pl-2'}`}>
                  <NavLink to={'/settings'} 
                     className= {({ isActive }) =>
                     `flex items-center gap-x-4 py-3 px-2 rounded transition-all duration-300 hover:bg-gray-700  ${
                     isCollapsed ? 'justify-center' : ''
                     } ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400'}`
                  }>
                     <i className="bi bi-gear text-gray-300"></i>
                     {!isCollapsed && (
                        <div className="flex gap-x-4 text-gray-400 font-bold">
                           <p>Settings</p>
                        </div>
                     )}
                  </NavLink>
               </div>
            </div>
         </div>
         <div className={`flex gap-x-4 text-red-300 font-bold py-3 px-2 hover:bg-gray-700 rounded cursor-pointer 
            ${isCollapsed ? 'justify-center' : 'ml-2 '}`}>
            <i className="bi bi-box-arrow-right"></i>
            {!isCollapsed && <p>Log Out</p>}
         </div>
      </div>

   ) 
}

export default Sidebar;
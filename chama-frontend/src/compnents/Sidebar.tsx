import { useState } from "react";

function Sidebar () {
   const[isCollapsed, setIsCollapsed] = useState(false)


   return (
      <div 
         className={`sidebar h-screen bg-[#1f2937] text-white ${isCollapsed? 'w-fit p-2': 'w-fit pl-6 pr-6'} transition-all duration-500 ease-in-out`}>
         {/* toggle button */}
         <div className="sidebar-toggle-btn hover:bg-gray-600">
            <button onClick={() => setIsCollapsed(!isCollapsed)}
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
            <div className={`sidebar-nav flex flex-col gap-y-4 pt-7 pb-7 text-gray-400 font-bold ${!isCollapsed ? 'pl-2' : ''}`}>
               <h4 className={`flex ${isCollapsed ? 'justify-center' : ''}`}>Main</h4>

               {[
                  ['bi-people-fill', 'Membership'],
                  ['bi-newspaper', 'Soft loans'],
                  ['bi-house-check', 'Meetings'],
                  ['bi-graph-up', 'Shares'],
                  ['bi-bell', 'Notifications'],
                  ['bi-diagram-2', 'Mpesa'],
               ].map(([icon, label]) => (
                  <div key={label} className={`flex items-top gap-x-4 ${isCollapsed ? 'justify-center' : ''}`}>
                     <i className={`bi ${icon} text-gray-300`}></i>
                     {!isCollapsed && <p className="transition duration-300">{label}</p>}
                  </div>
               ))}
            </div>
            
            {/* Settings */}
            <div className={`flex gap-x-4 pt-6 items-center ${isCollapsed ? 'justify-center' : ''} ${!isCollapsed ? 'pl-2' : ''}`}>
               <i className="bi bi-gear text-gray-300"></i>
               {!isCollapsed && (
                  <div className="flex gap-x-4 text-gray-400 font-bold">
                     <p>Settings</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   ) 
}

export default Sidebar;
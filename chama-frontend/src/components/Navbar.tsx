// components/Navbar.tsx
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { useRef } from "react";
import { NavLink, useParams } from "react-router-dom";

interface NavbarProps {
  chamas: { id: number; name: string }[];
  onCreateChama: () => void;
  handleJoinChama: (chamaId: number) => void;
}

const Navbar = ({ chamas, onCreateChama, handleJoinChama }: NavbarProps) => {
  const menuRef = useRef<any>(null);
  const chamaId = useParams()

  const menuItems: MenuItem[] = [
    ...chamas.map((chama) => ({
      label: chama.name,
      command: () => handleJoinChama(chama.id),
    })),
    { separator: true },
    {
      label: "Create New Chama",
      icon: "pi pi-plus",
      command: onCreateChama,
    },
  ];

  return (
    <div className="navbar flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <div className="flex items-center gap-x-6">
        <span>my chama app</span>
        <div className="relative">
          <div
            className="text-white rounded px-4 py-2"
            onClick={(e) => menuRef.current.toggle(e)}
          >
            Select Chama <i className="pi pi-chevron-down ml-2" />
          </div>
          <Menu model={menuItems} popup ref={menuRef} />
        </div>
      </div>
      <div className="flex gap-x-4 items-center">
        <i className="pi pi-bell" />
        <NavLink to={`/chamas/${chamaId}/account_settings`} className="flex items-center gap-x-2">
          <span>Agustine</span>
          <i className="pi pi-chevron-down" />
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;

// import { FC } from "react";

// interface Chama {
//   id: number;
//   name: string;
// }

// interface NavbarProps {
//   chamas: Chama[];
//   handleCreateChama: () => void;
//   handleJoinChama: (chamaId: number) => void;
// }

// const Navbar: FC<NavbarProps> = ({
//   chamas,
//   handleCreateChama,
//   handleJoinChama,
// }) => {
//   return (
//     <div className="navbar p-4 flex justify-between items-center bg-[#111827]">
//       <h1 className="text-xl font-bold">My Chama App</h1>

//       <div className="flex items-center gap-4">
//         <div className="relative group">
//           <button className="hover:text-blue-400">Switch Chama</button>
//           <div className="absolute hidden group-hover:block bg-white text-black shadow-md rounded mt-2">
//             {chamas.map((chama) => (
//               <div
//                 key={chama.id}
//                 onClick={() => handleJoinChama(chama.id)}
//                 className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
//               >
//                 {chama.name}
//               </div>
//             ))}
//             <div
//               onClick={handleCreateChama}
//               className="px-4 py-2 bg-blue-50 hover:bg-blue-100 cursor-pointer font-semibold border-t"
//             >
//               + Create New Chama
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
//  export const UserRole = {
//     ADMIN: "admin" as const,
//     MEMBER: "member" as const,
//     GUEST: "guest" as const,
// };
// export type UserRole = (typeof UserRole)[keyof typeof UserRole];   

import { UserRole } from "../data/user-role";
import { RadioButton } from "primereact/radiobutton";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function ChamaUserRole({ role }: { role: UserRole | string }): React.ReactElement {
    const [userRole, setUserRole] = useState<UserRole | string>(role);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserRole = localStorage.getItem("userRole");
        const isFirstLogin = localStorage.getItem("isFirstLogin");
        const authToken = localStorage.getItem("authToken");

        // If no auth token, redirect to login
        if (!authToken) {
            navigate("/signin");
            return;
        }

        // If user already has a role and it's not their first login, redirect accordingly
        if (storedUserRole && isFirstLogin === "false") {
            if (storedUserRole === UserRole.ADMIN.toString()) {
                navigate("/admin/chamas/1");
            } else if (storedUserRole === UserRole.MEMBER.toString()) {
                navigate("/chama-list-view");
            }
            return;
        }

        // Set initial role if stored
        if (storedUserRole) {
            setUserRole(storedUserRole);
        }
    }, [navigate]);

    // Function to get the display name for a role
    const getRoleDisplayName = (roleValue: UserRole | string): string => {
        if (roleValue === UserRole.ADMIN) return "Administrator";
        if (roleValue === UserRole.MEMBER) return "Member";
        return String(roleValue);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Save the selected role
        localStorage.setItem("userRole", userRole as string);
        localStorage.setItem("isFirstLogin", "false");
        
        // Navigate based on selected role
        if (userRole === UserRole.ADMIN || userRole === UserRole.ADMIN.toString()) {
            navigate("/create-chama");
        } else if (userRole === UserRole.MEMBER || userRole === UserRole.MEMBER.toString()) {
            navigate("/chama-list-view");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-white mb-2">Choose Your Role</h4>
                    <p className="text-gray-400">Please select a role to continue</p>
                    <p className="text-gray-300 mt-2">Current selection: {getRoleDisplayName(userRole)}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                            <RadioButton 
                                inputId="admin" 
                                name="role" 
                                value={UserRole.ADMIN} 
                                onChange={(e) => setUserRole(e.value)} 
                                checked={userRole === UserRole.ADMIN} 
                            />
                            <label htmlFor="admin" className="text-white cursor-pointer flex-1">Administrator</label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                            <RadioButton 
                                inputId="member" 
                                name="role" 
                                value={UserRole.MEMBER} 
                                onChange={(e) => setUserRole(e.value)} 
                                checked={userRole === UserRole.MEMBER} 
                            />
                            <label htmlFor="member" className="text-white cursor-pointer flex-1">Member</label>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition-colors"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );

}

export function ChamaUserRoleBadge({ role }: { role: string }): React.ReactElement {
  switch (role) {
    case "admin":
      return <span className="badge badge-primary">Admin</span>;
    case "member":
      return <span className="badge badge-secondary">Member</span>;
    default:
      return <span className="badge badge-light">Unknown Role</span>;
  }
}
export function ChamaUserRoleIcon({ role }: { role: string }): React.ReactElement {
  switch (role) {
    case "admin":
      return <i className="bi bi-shield-lock-fill text-primary"></i>;
    case "member":
      return <i className="bi bi-person-fill text-secondary"></i>;
    default:
      return <i className="bi bi-question-circle-fill text-light"></i>;
  }
}
export function ChamaUserRoleColor({ role }: { role: string }): string {
  switch (role) {
    case "admin":
      return "text-primary";
    case "member":
      return "text-secondary";
    default:
      return "text-light";
  }
}
export function ChamaUserRoleClassName(role: string): string {
  switch (role) {
    case "admin":
      return "bg-primary text-white";
    case "member":
      return "bg-secondary text-white";
    default:
      return "bg-light text-dark";
  }
}  
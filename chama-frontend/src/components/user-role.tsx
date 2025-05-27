  
import { UserType } from "../data/user-role";
import { RadioButton } from "primereact/radiobutton";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function ChamaUserType({ role }: { role: UserType | string }): React.ReactElement {
    const [userType, setUserType] = useState<UserType | string>(role);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserType = localStorage.getItem("userType");
        const isFirstLogin = localStorage.getItem("isFirstLogin");
        const authToken = localStorage.getItem("authToken");

        // If no auth token, redirect to login
        if (!authToken) {
            navigate("/signin");
            return;
        }

        // If user already has a role and it's not their first login, redirect accordingly
        if (storedUserType && isFirstLogin === "false") {
            if (storedUserType === UserType.ADMIN.toString()) {
                navigate("/admin/chamas/1");
            } else if (storedUserType === UserType.MEMBER.toString()) {
                navigate("/chama-list-view");
            }
            return;
        }

        // Set initial role if stored
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, [navigate]);

    // Function to get the display name for a role
    const getRoleDisplayName = (roleValue: UserType | string): string => {
        if (roleValue === UserType.ADMIN) return "Administrator";
        if (roleValue === UserType.MEMBER) return "Member";
        return String(roleValue);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Save the selected role
        localStorage.setItem("userType", userType as string);
        localStorage.setItem("isFirstLogin", "false");
        
        // Navigate based on selected role
        if (userType === UserType.ADMIN || userType === UserType.ADMIN.toString()) {
            navigate("/create-chama");
        } else if (userType === UserType.MEMBER || userType === UserType.MEMBER.toString()) {
            navigate("/chama-list-view");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-white mb-2">Choose Your Role</h4>
                    <p className="text-gray-400">Please select a role to continue</p>
                    <p className="text-gray-300 mt-2">Current selection: {getRoleDisplayName(userType)}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                            <RadioButton 
                                inputId="admin" 
                                name="role" 
                                value={UserType.ADMIN} 
                                onChange={(e) => setUserType(e.value)} 
                                checked={userType === UserType.ADMIN} 
                            />
                            <label htmlFor="admin" className="text-white cursor-pointer flex-1">Administrator</label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                            <RadioButton 
                                inputId="member" 
                                name="role" 
                                value={UserType.MEMBER} 
                                onChange={(e) => setUserType(e.value)} 
                                checked={userType === UserType.MEMBER} 
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

export function ChamaUserTypeBadge({ role }: { role: string }): React.ReactElement {
  switch (role) {
    case "admin":
      return <span className="badge badge-primary">Admin</span>;
    case "member":
      return <span className="badge badge-secondary">Member</span>;
    default:
      return <span className="badge badge-light">Unknown Role</span>;
  }
}
export function ChamaUserTypeIcon({ role }: { role: string }): React.ReactElement {
  switch (role) {
    case "admin":
      return <i className="bi bi-shield-lock-fill text-primary"></i>;
    case "member":
      return <i className="bi bi-person-fill text-secondary"></i>;
    default:
      return <i className="bi bi-question-circle-fill text-light"></i>;
  }
}
export function ChamaUserTypeColor({ role }: { role: string }): string {
  switch (role) {
    case "admin":
      return "text-primary";
    case "member":
      return "text-secondary";
    default:
      return "text-light";
  }
}
export function ChamaUserTypeClassName(role: string): string {
  switch (role) {
    case "admin":
      return "bg-primary text-white";
    case "member":
      return "bg-secondary text-white";
    default:
      return "bg-light text-dark";
  }
}  
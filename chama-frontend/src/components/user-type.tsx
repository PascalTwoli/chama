import { UserType } from "../data/user-type";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth/signup-service";

interface ChamaUserTypeProps {
    type: UserType | string;
}

export function ChamaUserType({ type }: ChamaUserTypeProps): React.ReactElement {
    const [userType, setUserType] = useState<UserType | string>(type);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndRedirect = async () => {
            const authToken = localStorage.getItem("authToken");
            if (!authToken) {
                navigate("/signin");
                return;
            }

            try {
                const status = await AuthService.checkOnboardingStatus();
                if (!status.needsUserType) {
                    if (status.activeUserType === UserType.ADMIN) {
                        if (localStorage.getItem("hasCreatedChama") === "true") {
                            const activeChamaId = localStorage.getItem("activeChamaId") || "1";
                            navigate(`/admin/chamas/${activeChamaId}`);
                        } else {
                            navigate("/create-chama");
                        }
                    } else if (status.activeUserType === UserType.MEMBER) {
                        if (localStorage.getItem("hasJoinedChama") === "true") {
                            const activeChamaId = localStorage.getItem("activeChamaId") || "1";
                            navigate(`/member/chamas/${activeChamaId}`);
                        } else {
                            navigate("/chama-list-view");
                        }
                    } else {
                        navigate("/signin");
                    }
                } else if (status.activeUserType) {
                    setUserType(status.activeUserType);
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                navigate("/signin");
            }
        };

        checkAuthAndRedirect();
    }, [navigate]);

    useEffect(() => {
        if (error && toast.current) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error,
                life: 5000
            });
        }
    }, [error]);

    const getRoleDisplayName = (typeValue: UserType | string): string => {
        const normalizedType = AuthService.normalizeUserType(typeValue);
        if (normalizedType === UserType.ADMIN) return "Administrator";
        if (normalizedType === UserType.MEMBER) return "Member";
        return String(typeValue);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const normalizedType = AuthService.normalizeUserType(userType);
            if (!normalizedType) {
                setError("Invalid user type selected. Please try again.");
                setIsLoading(false);
                return;
            }

            const currentUser = await AuthService.getCurrentUser();
            const userId = currentUser.id;
            const userData = await AuthService.updateUserType(userId, {
                activeUserType: normalizedType,
            });

            if (toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: `User type updated to ${getRoleDisplayName(normalizedType)}`,
                    life: 3000
                });
            }

            if (normalizedType === UserType.ADMIN) {
                navigate("/create-chama");
            } else if (normalizedType === UserType.MEMBER) {
                navigate("/chama-list-view");
            } else {
                navigate("/signin");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update user type. Please try again.");
            console.error("Error updating user type:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Toast ref={toast} position="top-right" />
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
                        disabled={isLoading}
                        className={`w-full py-3 px-4 ${isLoading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md font-semibold transition-colors flex justify-center items-center`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Continue'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

interface UserTypeProps {
    role: UserType | string;
}

export function ChamaUserTypeBadge({ role }: UserTypeProps): React.ReactElement {
    const normalizedType = AuthService.normalizeUserType(role);
    switch (normalizedType) {
        case UserType.ADMIN:
            return <span className="badge badge-primary">Admin</span>;
        case UserType.MEMBER:
            return <span className="badge badge-secondary">Member</span>;
        default:
            return <span className="badge badge-light">Unknown Role</span>;
    }
}

export function ChamaUserTypeIcon({ role }: UserTypeProps): React.ReactElement {
    const normalizedType = AuthService.normalizeUserType(role);
    switch (normalizedType) {
        case UserType.ADMIN:
            return <i className="bi bi-shield-lock-fill text-primary"></i>;
        case UserType.MEMBER:
            return <i className="bi bi-person-fill text-secondary"></i>;
        default:
            return <i className="bi bi-question-circle-fill text-light"></i>;
    }
}

export function ChamaUserTypeColor({ role }: UserTypeProps): string {
    const normalizedType = AuthService.normalizeUserType(role);
    switch (normalizedType) {
        case UserType.ADMIN:
            return "text-primary";
        case UserType.MEMBER:
            return "text-secondary";
        default:
            return "text-light";
    }
}

export function ChamaUserTypeClassName(role: UserType | string): string {
    const normalizedType = AuthService.normalizeUserType(role);
    switch (normalizedType) {
        case UserType.ADMIN:
            return "bg-primary text-white";
        case UserType.MEMBER:
            return "bg-secondary text-white";
        default:
            return "bg-light text-dark";
    }
}
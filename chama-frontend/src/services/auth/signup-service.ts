import { AxiosError, AxiosResponse } from "axios";
import apiClient, { API_BASE } from "../../config/axios-config";
import { SignupRequest, SignupResponse, ApiErrorResponse, User } from "../../models/user";
import { UserType } from "../../data/user-type";

/**
 * Interface for onboarding status information
 */
interface OnboardingStatus {
    needsUserType: boolean;
    needsChama: boolean;
    userType: UserType | null;
}

// service class for authentication related API calls
export class AuthService {
    /**
     * Normalize user type to consistent enum format
     * @param userType The user type to normalize
     * @returns Normalized UserType enum or null if invalid
     */
    static normalizeUserType(userType: UserType | string | null): UserType | null {
        if (!userType) return null;
        
        const typeStr = userType.toString().toUpperCase();
        return typeStr === UserType.ADMIN.toString() ? UserType.ADMIN :
               typeStr === UserType.MEMBER.toString() ? UserType.MEMBER : null;
    }
	 
	static async signup(userData: SignupRequest): Promise<SignupResponse> {
		try {
			const response: AxiosResponse<SignupResponse> = await apiClient.post(
				"/auth/signup",
				userData
			);
			return response.data;
		} catch (error) {
			// Log full error for debugging
			console.error('Registration error:', error);
			
			// Handle network errors (no response from server)
			if (!(error as AxiosError).response) {
				console.error('Network error during registration:', error);
				throw new Error("Could not connect to the server. Please check your internet connection and try again.");
			}
			
			const axiosError = error as AxiosError<ApiErrorResponse>;
			const statusCode = axiosError.response?.status;
			const errorResponse = axiosError.response?.data;
			
			// Log the response for debugging
			console.log('Error response data:', errorResponse);
			
			// Extract error message from various possible formats
			let errorMessage = '';
			
			// Handle array of error messages
			if (errorResponse && Array.isArray(errorResponse.message)) {
				errorMessage = errorResponse.message[0] || '';
			} 
			// Handle structured validation errors
			else if (errorResponse && Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0) {
				errorMessage = errorResponse.errors[0]?.message || '';
			}
			// Handle simple string message
			else if (errorResponse && typeof errorResponse.message === 'string') {
				errorMessage = errorResponse.message || '';
			}
			// Handle message in error field
			else if (errorResponse && typeof errorResponse.error === 'string') {
				errorMessage = errorResponse.error || '';
			}
			// Default message if none found
			else {
				errorMessage = 'Registration failed. Please try again.';
			}
			
			// Handle specific error types based on status and message content
			const errorMessageLower = errorMessage.toLowerCase();
			
			// Email already exists - either from status code or message content
			if (statusCode === 409 || 
				(errorMessageLower.includes('email') && 
				(errorMessageLower.includes('exist') || errorMessageLower.includes('taken') || errorMessageLower.includes('already')))) {
				throw new Error("Email is already registered. Please use a different email or sign in.");
			}
			// Validation errors
			else if (statusCode === 400 && 
				(errorMessageLower.includes('valid') || errorMessageLower.includes('required'))) {
				throw new Error(`Validation error: ${errorMessage}`);
			}
			// Server errors
			else if (statusCode === 500 || 
				errorMessageLower.includes('server error') ||
				errorMessageLower.includes('internal')) {
				console.error('Server error during registration:', axiosError);
				throw new Error("An internal server error occurred. Our team has been notified. Please try again later.");
			}
			// Rate limiting
			else if (statusCode === 429) {
				throw new Error("Too many registration attempts. Please try again later.");
			}
			
			// For all other errors, use the extracted message
			throw new Error(errorMessage);
		}
	}

	/**
	 * Check if email is already registered
	 * @param email Email to check
	 * @returns Promise indicating if email exists
	 */
	static async checkEmailExists(email: string): Promise<boolean> {
		try {
			const response: AxiosResponse = await apiClient.post(
				`/user/check-email`,
				{ email }
			);
			return response.data.exists;
		} catch (error) {
			// If there's an error, assume the email doesn't exist
			return false;
		}
	}

	/**
	 * Update user type (admin or member)
	 * @param userType The user type to set
	 * @returns Promise with updated user data
	 */
	static async updateUserType(userType: UserType): Promise<User> {
		try {
			const token = localStorage.getItem('authToken');
			if (!token) {
				throw new Error("Authentication required. Please sign in.");
			}

			// Extract user ID from token or get from localStorage
			const userId = localStorage.getItem('userId');
			if (!userId) {
				throw new Error("User ID not found. Please sign in again.");
			}

			console.log(`Updating user type to ${userType} for user ${userId}`);
			
			// Ensure we're sending the correct enum value to match backend expectations
			// The backend might be expecting just "ADMIN" or "MEMBER" without lowercase conversion
			
			// Use the correct path without /api/v1 since it's already in API_BASE
			const response: AxiosResponse<User> = await apiClient.patch(
				`/user/${userId}`,
				{ userType }, // Send the enum value directly, which should match the backend DTO
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			
			// Store userType in localStorage for client-side usage
			localStorage.setItem("userType", userType.toString());
			
			return response.data;
		} catch (error) {
			console.error('Error updating user type:', error);
			
			if (!(error as AxiosError).response) {
				throw new Error("Could not connect to the server. Please check your internet connection and try again.");
			}
			
			const axiosError = error as AxiosError<ApiErrorResponse>;
			const statusCode = axiosError.response?.status;
			const errorResponse = axiosError.response?.data;
			
			let errorMessage = 'Failed to update user type. Please try again.';
			
			if (errorResponse && typeof errorResponse.message === 'string') {
				errorMessage = errorResponse.message;
			} else if (errorResponse && Array.isArray(errorResponse.message)) {
				errorMessage = errorResponse.message[0] || errorMessage;
			}
			
			if (statusCode === 401 || statusCode === 403) {
				throw new Error("Authentication required. Please sign in again.");
			} else if (statusCode === 400) {
				throw new Error(`Invalid user type: ${errorMessage}`);
			} else if (statusCode === 500) {
				throw new Error("Server error occurred. Please try again later.");
			}
			
			throw new Error(errorMessage);
		}
	}

	/**
	 * Get current user's type
	 * @param forceCheck Whether to force checking with the server instead of using cached value
	 * @returns Promise with user type or null if not set
	 */
	static async getUserType(forceCheck: boolean = false): Promise<UserType | null> {
		try {
			// First try to get from localStorage if not forcing check
			if (!forceCheck) {
				const cachedUserType = localStorage.getItem("userType");
				if (cachedUserType) {
					const normalizedType = this.normalizeUserType(cachedUserType);
					if (normalizedType) {
						return normalizedType;
					}
				}
			}

			const token = localStorage.getItem('authToken');
			if (!token) {
				return null;
			}

			const response: AxiosResponse<{ userType: UserType }> = await apiClient.get(
				"/user/type",
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			
			const userType = response.data.userType;
			const normalizedUserType = this.normalizeUserType(userType);
			
			// Update localStorage with the normalized user type
			if (normalizedUserType) {
				localStorage.setItem("userType", normalizedUserType.toString());
			}
			
			return normalizedUserType;
		} catch (error) {
			console.error('Error fetching user type:', error);
			
			// For this method, we'll return null on error since it might be
			// called during app initialization and shouldn't break the app flow
			return null;
		}
	}
	
	/**
	 * Check user's onboarding status
	 * @returns Object with details about onboarding status
	 */
	static checkOnboardingStatus(): OnboardingStatus {
		const userType = localStorage.getItem("userType");
		const isFirstLogin = localStorage.getItem("isFirstLogin") !== "false";
		const hasCreatedChama = localStorage.getItem("hasCreatedChama") === "true";
		const hasJoinedChama = localStorage.getItem("hasJoinedChama") === "true";

		return {
			needsUserType: !userType || isFirstLogin,
			needsChama: userType ? (
				userType === UserType.ADMIN.toString() ? !hasCreatedChama : !hasJoinedChama
			) : false,
			userType: userType ? this.normalizeUserType(userType) : null
		};
	}
	
	/**
	 * Get the appropriate redirect path based on user's onboarding status
	 * @returns The path to redirect the user to
	 */
	static getRedirectPath(): string {
		// Check authentication
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			return "/signin";
		}
		
		const status = this.checkOnboardingStatus();
		
		if (status.needsUserType) {
			return "/chose-user";
		}
		
		if (status.userType === UserType.ADMIN) {
			if (!localStorage.getItem("hasCreatedChama") || localStorage.getItem("hasCreatedChama") !== "true") {
				return "/create-chama";
			}
			const activeChamaId = localStorage.getItem("activeChamaId") || "1";
			return `/admin/chamas/${activeChamaId}`;
		}
		
		if (status.userType === UserType.MEMBER) {
			if (!localStorage.getItem("hasJoinedChama") || localStorage.getItem("hasJoinedChama") !== "true") {
				return "/chama-list-view";
			}
			const activeChamaId = localStorage.getItem("activeChamaId") || "1";
			return `/member/chamas/${activeChamaId}`;
		}
		
		return "/signin";
	}
	
	/**
	 * Mark chama creation as complete for admin users
	 * @param chamaId ID of the created chama
	 */
	static markChamaCreationComplete(chamaId: string): void {
		localStorage.setItem("hasCreatedChama", "true");
		localStorage.setItem("activeChamaId", chamaId);
	}
	
	/**
	 * Mark chama joining as complete for member users
	 * @param chamaId ID of the joined chama
	 */
	static markChamaJoiningComplete(chamaId: string): void {
		localStorage.setItem("hasJoinedChama", "true");
		localStorage.setItem("activeChamaId", chamaId);
	}
}

export default AuthService;

import { AxiosError, AxiosResponse } from "axios";
import apiClient, { API_BASE } from "../../config/axios-config";

// Request interfaces
export interface SignupRequest {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
}

// Response interfaces
export interface SignupResponse {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	message?: string;
	token?: string;
}

// API error response interface
export interface ApiErrorResponse {
	message: string | string[];
	statusCode?: number;
	error?: string;
	errors?: Array<{ message: string; field?: string }>;  // For validation errors
}


 // Service class for authentication related API calls
 
export class AuthService {
	
	 //* Register a new user
	 //* @param userData User registration data
	 //* @returns Promise with the API response
	 
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
}

export default AuthService;

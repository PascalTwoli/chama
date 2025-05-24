import { AxiosError, AxiosResponse } from "axios";
import apiClient, { API_BASE } from "../config/axios-config";



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
  message: string;
  statusCode?: number;
}

/**
 * Service class for authentication related API calls
 */
export class AuthService {
  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise with the API response
   */
  static async signup(userData: SignupRequest): Promise<SignupResponse> {
    try {
      const response: AxiosResponse<SignupResponse> = await apiClient.post(
        '/auth/signup',
        userData
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // Format the error message
      const errorMessage = 
        axiosError.response?.data?.message || 
        "Registration failed. Please try again.";
      
      // Throw a custom error with the message
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


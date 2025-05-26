import {AxiosError, AxiosResponse } from 'axios';
import apiClient, { setAuthHeader } from '../../config/axios-config';
import { ApiErrorResponse, SignInCredentials, SignInResponse } from '../../models/user';

export class AuthService {
    static async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
        try {
            const response: AxiosResponse<SignInResponse> = await apiClient.post('/auth/login', credentials);
            //save tokens to local storage
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            
            // Update the Authorization header
            setAuthHeader(apiClient, response.data.token);
            console.log('Sign-in successful:', response.data);
            return response.data;
        } catch (error) {
            // Log full error object for debugging
            console.error('Error during sign-in:', error);
            
            // Handle network errors (no response from server)
            if (!(error as AxiosError).response) {
                console.error('Network error - no response from server:', error);
                throw new Error("network: Could not connect to the server. Please check your internet connection and try again.");
            }
            
            const axiosError = error as AxiosError<ApiErrorResponse>;
            
            // Check for specific status codes
            const statusCode = axiosError.response?.status;
            const errorResponse = axiosError.response?.data;
            
            // Log the response for debugging
            console.log('Error response data:', errorResponse);
            
            // Extract error message from various possible formats
            let errorMessageRaw = '';
            
            // Handle array of error messages
            if (errorResponse && Array.isArray(errorResponse.message)) {
                errorMessageRaw = errorResponse.message[0] || '';
            } 
            // Handle structured validation errors
            else if (errorResponse && Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0) {
                errorMessageRaw = errorResponse.errors[0]?.message || '';
            }
            // Handle simple string message
            else if (errorResponse && typeof errorResponse.message === 'string') {
                errorMessageRaw = errorResponse.message || '';
            }
            // Handle message in error field
            else if (errorResponse && typeof errorResponse.error === 'string') {
                errorMessageRaw = errorResponse.error || '';
            }
            // Default message if none found
            else {
                errorMessageRaw = 'Failed to sign in. Please check your credentials and try again.';
            }
            
            // Normalize message for pattern matching
            const errorMessageLower = errorMessageRaw.toLowerCase();
            
            // Handle specific error types based on status code and message content
            if (statusCode === 404 || 
                errorMessageLower.includes('not found') || 
                errorMessageLower.includes('no user') ||
                errorMessageLower.includes('user not exist')) {
                throw new Error("unregistered email: This email is not registered. Please sign up first.");
            } 
            else if (statusCode === 401 || 
                    errorMessageLower.includes('password') || 
                    errorMessageLower.includes('invalid credentials') ||
                    errorMessageLower.includes('unauthorized')) {
                throw new Error("incorrect password: The password you entered is incorrect. Please try again.");
            }
            else if (statusCode === 500 || 
                    errorMessageLower.includes('server error') ||
                    errorMessageLower.includes('internal')) {
                console.error('Server error during sign-in:', axiosError);
                throw new Error("server: An internal server error occurred. Our team has been notified. Please try again later.");
            }
            else if (statusCode === 429) {
                throw new Error("rate-limit: Too many login attempts. Please try again later.");
            }
            
            // For all other errors, use the original message with a fallback
            throw new Error(errorMessageRaw || 'An unknown error occurred. Please try again later.');
        }
    }
}

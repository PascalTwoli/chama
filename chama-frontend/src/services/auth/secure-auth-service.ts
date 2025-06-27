import { AxiosError, AxiosResponse } from 'axios';
import apiClient, { setAuthHeader } from '../../config/axios-config';
import {
  ApiErrorResponse,
  SignInCredentials,
  SignInResponse,
} from '../../models/user';
import SecureTokenStorage, {
  TokenType,
} from '../../utils/secure-token-storage';

/**
 * Secure Authentication Service
 *
 * Manages authentication using HTTP-only cookies for secure token storage.
 * Replaces localStorage-based token management to prevent XSS attacks.
 */
export class SecureAuthService {
  /**
   * Sign in a user and store tokens securely in cookies
   */
  static async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
    try {
      const response: AxiosResponse<SignInResponse> = await apiClient.post(
        '/auth/login',
        credentials
      );

      // Store tokens in secure cookies instead of localStorage
      if (response.data.token) {
        SecureTokenStorage.setAuthToken(response.data.token);

        // Check if this is an admin user and store admin token if needed
        // This logic can be customized based on your role detection mechanism
        if (response.data.user?.role === 'admin') {
          SecureTokenStorage.setAdminToken(response.data.token);
        }
      }

      if (response.data.refreshToken) {
        // For refresh tokens, we'll use a separate cookie with longer expiration
        SecureTokenStorage.setToken(
          'refresh_token' as TokenType,
          response.data.refreshToken,
          { maxAge: 7 * 24 * 60 * 60 } // 7 days
        );
      }

      // Update the Authorization header for immediate API calls
      setAuthHeader(apiClient, response.data.token);

      // Clear any existing localStorage tokens for security
      this.clearLegacyTokens();

      console.log('Secure sign-in successful:', {
        user: response.data.user,
        tokenStored: SecureTokenStorage.isAuthenticated(),
      });

      return response.data;
    } catch (error) {
      // Enhanced error handling
      console.error('Error during secure sign-in:', error);

      // Handle network errors
      if (!(error as AxiosError).response) {
        console.error('Network error - no response from server:', error);
        throw new Error(
          'network: Could not connect to the server. Please check your internet connection and try again.'
        );
      }

      const axiosError = error as AxiosError<ApiErrorResponse>;
      const statusCode = axiosError.response?.status;
      const errorResponse = axiosError.response?.data;

      // Extract and format error message
      const errorMessageRaw = this.extractErrorMessage(errorResponse);
      const errorMessageLower = errorMessageRaw.toLowerCase();

      // Handle specific error types
      if (
        statusCode === 404 ||
        errorMessageLower.includes('not found') ||
        errorMessageLower.includes('no user') ||
        errorMessageLower.includes('user not exist')
      ) {
        throw new Error(
          'unregistered email: This email is not registered. Please sign up first.'
        );
      } else if (
        statusCode === 401 ||
        errorMessageLower.includes('password') ||
        errorMessageLower.includes('invalid credentials') ||
        errorMessageLower.includes('unauthorized')
      ) {
        throw new Error(
          'incorrect password: The password you entered is incorrect. Please try again.'
        );
      } else if (
        statusCode === 500 ||
        errorMessageLower.includes('server error') ||
        errorMessageLower.includes('internal')
      ) {
        console.error('Server error during sign-in:', axiosError);
        throw new Error(
          'server: An internal server error occurred. Our team has been notified. Please try again later.'
        );
      } else if (statusCode === 429) {
        throw new Error(
          'rate-limit: Too many login attempts. Please try again later.'
        );
      }

      throw new Error(
        errorMessageRaw || 'An unknown error occurred. Please try again later.'
      );
    }
  }

  /**
   * Sign out the user and clear all tokens
   */
  static async signOut(): Promise<void> {
    try {
      // Call the logout endpoint
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear all authentication tokens from cookies
      SecureTokenStorage.clearAllTokens();
      SecureTokenStorage.removeToken('refresh_token' as TokenType);

      // Clear authorization header
      setAuthHeader(apiClient, null);

      // Clear any legacy localStorage tokens
      this.clearLegacyTokens();

      // Clear session storage
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }

      console.log('Secure sign-out completed');
    }
  }

  /**
   * Get the current authentication token
   */
  static getCurrentToken(): string | null {
    return SecureTokenStorage.getAuthToken();
  }

  /**
   * Get the current refresh token
   */
  static getRefreshToken(): string | null {
    return SecureTokenStorage.getToken('refresh_token' as TokenType);
  }

  /**
   * Check if user is currently authenticated
   */
  static isAuthenticated(): boolean {
    return SecureTokenStorage.isAuthenticated();
  }

  /**
   * Check if user has admin privileges
   */
  static isAdmin(): boolean {
    return SecureTokenStorage.isAdmin();
  }

  /**
   * Refresh the authentication token
   */
  static async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    try {
      const response = await apiClient.post(
        `/auth/refresh-token?refreshToken=${refreshToken}`
      );

      if (response.data.idToken) {
        // Store the new token securely
        SecureTokenStorage.setAuthToken(response.data.idToken);

        if (response.data.refreshToken) {
          SecureTokenStorage.setToken(
            'refresh_token' as TokenType,
            response.data.refreshToken,
            { maxAge: 7 * 24 * 60 * 60 }
          );
        }

        // Update authorization header
        setAuthHeader(apiClient, response.data.idToken);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, sign out the user
      await this.signOut();
      return false;
    }
  }

  /**
   * Initialize authentication state on app startup
   */
  static initializeAuth(): boolean {
    const token = this.getCurrentToken();
    if (token) {
      // Set the token in axios headers
      setAuthHeader(apiClient, token);
      return true;
    }
    return false;
  }

  /**
   * Clear legacy localStorage tokens for security
   */
  private static clearLegacyTokens(): void {
    if (typeof localStorage !== 'undefined') {
      const legacyKeys = [
        'authToken',
        'refreshToken',
        'userRole',
        'isFirstLogin',
        'user',
        'token',
      ];

      legacyKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }

  /**
   * Extract error message from API response
   */
  private static extractErrorMessage(errorResponse: any): string {
    if (errorResponse && Array.isArray(errorResponse.message)) {
      return errorResponse.message[0] || '';
    } else if (
      errorResponse &&
      Array.isArray(errorResponse.errors) &&
      errorResponse.errors.length > 0
    ) {
      return errorResponse.errors[0]?.message || '';
    } else if (errorResponse && typeof errorResponse.message === 'string') {
      return errorResponse.message || '';
    } else if (errorResponse && typeof errorResponse.error === 'string') {
      return errorResponse.error || '';
    }

    return 'Failed to sign in. Please check your credentials and try again.';
  }
}

export default SecureAuthService;

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import SecureTokenStorage from '../utils/secure-token-storage';
import SecureAuthService from '../services/auth/secure-auth-service';

/**
 * Secure Axios Configuration
 * 
 * This replaces the localStorage-based axios configuration with secure cookie-based storage.
 * Compatible with Firebase auth guard that checks Authorization header and cookie fallback.
 */

// Backend API base URL
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5500/api/v1';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Get current authentication token from secure cookie storage
 */
export const getAuthToken = (): string | null => {
  return SecureTokenStorage.getAuthToken();
};

/**
 * Get refresh token from secure cookie storage
 */
export const getRefreshToken = (): string | null => {
  return SecureAuthService.getRefreshToken();
};

/**
 * Set auth token in request headers
 */
export const setAuthHeader = (instance: AxiosInstance, token: string | null): void => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

/**
 * Subscribe to token refresh
 */
const subscribeToTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * Execute refresh subscribers with new token
 */
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

/**
 * Refresh authentication token using secure service
 */
export const refreshAuthToken = async (refreshToken: string): Promise<any> => {
  try {
    const refreshSuccess = await SecureAuthService.refreshToken();
    
    if (refreshSuccess) {
      const newToken = getAuthToken();
      const newRefreshToken = getRefreshToken();
      
      return {
        idToken: newToken,
        refreshToken: newRefreshToken
      };
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

/**
 * Secure logout function
 */
export const logout = async (apiClient: AxiosInstance): Promise<void> => {
  await SecureAuthService.signOut();
  setAuthHeader(apiClient, null);
  refreshSubscribers = [];
  isRefreshing = false;
};

/**
 * Setup request interceptor to add auth token from secure storage
 */
const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config) => {
      // Get token from secure cookie storage
      const token = getAuthToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

/**
 * Setup response interceptor to handle token expiration
 */
const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      
      // Check if error is due to expired token (401 Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, wait for new token
          return new Promise<AxiosResponse>((resolve) => {
            subscribeToTokenRefresh((token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(axios(originalRequest));
            });
          });
        }
        
        // Set refreshing flag
        originalRequest._retry = true;
        isRefreshing = true;
        
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          await logout(instance);
          return Promise.reject(error);
        }
        
        try {
          // Attempt to refresh the token
          const response = await refreshAuthToken(refreshToken);
          const newToken = response.idToken;
          
          // Reset refreshing flag
          isRefreshing = false;
          
          // Update request headers
          setAuthHeader(instance, newToken);
          
          // Notify subscribers
          onTokenRefreshed(newToken);
          
          // Retry original request with new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Reset refreshing flag
          isRefreshing = false;
          
          // If refresh fails, log out
          await logout(instance);
          return Promise.reject(error);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

/**
 * Validate token on page load/refresh
 */
export const validateTokenOnLoad = async (apiClient: AxiosInstance): Promise<boolean> => {
  const currentToken = getAuthToken();
  const refreshToken = getRefreshToken();
  
  if (!currentToken) {
    return false;
  }
  
  // Set current token in headers
  setAuthHeader(apiClient, currentToken);
  
  try {
    // Try to make a request to verify the token is valid
    await apiClient.get('/auth/me');
    return true;
  } catch (error) {
    // If token is invalid, try to refresh it
    if (refreshToken) {
      try {
        const response = await refreshAuthToken(refreshToken);
        setAuthHeader(apiClient, response.idToken);
        return true;
      } catch (refreshError) {
        // If refresh fails, log out
        console.error('Token validation failed:', refreshError);
        await logout(apiClient);
        return false;
      }
    } else {
      // No refresh token available, log out
      await logout(apiClient);
      return false;
    }
  }
};

/**
 * Create and configure axios instance with secure interceptors
 */
export const createAxiosInstance = (baseURL = API_BASE): AxiosInstance => {
  // Create axios instance with credentials to support cookies
  const instance = axios.create({
    baseURL,
    withCredentials: true, // Enable cookies for cross-origin requests
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Setup interceptors
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
  
  return instance;
};

/**
 * Create default secure API client
 */
const apiClient = createAxiosInstance();

/**
 * Initialize authentication from secure storage on app startup
 */
export const initializeAuth = (): boolean => {
  return SecureAuthService.initializeAuth();
};

// Export the default secure apiClient
export default apiClient;


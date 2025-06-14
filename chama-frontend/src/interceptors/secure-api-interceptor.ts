import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import SecureTokenStorage from '../utils/secure-token-storage';
import SecureAuthService from '../services/auth/secure-auth-service';

/**
 * Secure API Interceptor
 *
 * Automatically injects bearer tokens from secure cookies into HTTP requests
 * and handles token refresh on 401 responses.
 */

// Backend API base URL
export const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5500/api/v1';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Get current authentication token from secure storage
 */
export const getAuthToken = (): string | null => {
  return SecureTokenStorage.getAuthToken();
};

/**
 * Get refresh token from secure storage
 */
export const getRefreshToken = (): string | null => {
  return SecureAuthService.getRefreshToken();
};

/**
 * Set auth token in request headers
 */
export const setAuthHeader = (
  instance: AxiosInstance,
  token: string | null
): void => {
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
 * Logout function to clear tokens securely
 */
export const secureLogout = async (apiClient: AxiosInstance): Promise<void> => {
  try {
    await SecureAuthService.signOut();
  } catch (error) {
    console.error('Error during secure logout:', error);
  }

  // Clear auth header
  setAuthHeader(apiClient, null);

  // Clear subscribers
  refreshSubscribers = [];
  isRefreshing = false;
};

/**
 * Setup request interceptor to add auth token from cookies
 */
const setupSecureRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    config => {
      // Get token from secure storage (cookies)
      const token = getAuthToken();

      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    error => Promise.reject(error)
  );
};

/**
 * Setup response interceptor to handle token expiration with secure refresh
 */
const setupSecureResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Check if error is due to expired token (401 Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, wait for new token
          return new Promise<AxiosResponse>(resolve => {
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

        try {
          // Attempt to refresh the token using secure service
          const refreshSuccess = await SecureAuthService.refreshToken();

          if (refreshSuccess) {
            const newToken = getAuthToken();

            if (newToken) {
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
            }
          }

          throw new Error('Token refresh failed');
        } catch (refreshError) {
          // Reset refreshing flag
          isRefreshing = false;

          // If refresh fails, log out securely
          await secureLogout(instance);

          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Validate token on page load/refresh using secure storage
 */
export const validateSecureTokenOnLoad = async (
  apiClient: AxiosInstance
): Promise<boolean> => {
  const currentToken = getAuthToken();

  if (!currentToken) {
    return false;
  }

  // Set current token in headers
  setAuthHeader(apiClient, currentToken);

  try {
    // Try to make a request to verify the token is valid
    await apiClient.get('/auth/me'); // Using the /auth/me endpoint to validate
    return true;
  } catch (error) {
    console.warn('Token validation failed, attempting refresh:', error);

    // If token is invalid, try to refresh it
    try {
      const refreshSuccess = await SecureAuthService.refreshToken();
      if (refreshSuccess) {
        const newToken = getAuthToken();
        if (newToken) {
          setAuthHeader(apiClient, newToken);
          return true;
        }
      }
    } catch (refreshError) {
      console.error('Token refresh during validation failed:', refreshError);
    }

    // If refresh fails, log out securely
    await secureLogout(apiClient);
    return false;
  }
};

/**
 * Create and configure axios instance with secure interceptors
 */
export const createSecureAxiosInstance = (
  baseURL = API_BASE
): AxiosInstance => {
  // Create axios instance with credentials support for cookies
  const instance = axios.create({
    baseURL,
    withCredentials: true, // Important: enables cookies in cross-origin requests
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Setup secure interceptors
  setupSecureRequestInterceptor(instance);
  setupSecureResponseInterceptor(instance);

  return instance;
};

/**
 * Create default secure API client
 */
const secureApiClient = createSecureAxiosInstance();

/**
 * Initialize secure authentication on app startup
 */
export const initializeSecureAuth = (): boolean => {
  const token = getAuthToken();
  if (token) {
    setAuthHeader(secureApiClient, token);
    console.log('Secure authentication initialized from cookies');
    return true;
  }
  console.log('No authentication token found in secure storage');
  return false;
};

// Export the secure API client as default
export default secureApiClient;

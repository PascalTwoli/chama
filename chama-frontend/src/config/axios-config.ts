import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
// Backend API base URL
export const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5500/api/v1';
// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
// Get current authentication token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};
// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};
// Set auth token in request headers
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
// Subscribe to token refresh
const subscribeToTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};
// Execute refresh subscribers with new token
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};
// Refresh authentication token
export const refreshAuthToken = async (refreshToken: string): Promise<any> => {
  try {
    // Use a fresh axios instance for token refresh to avoid interceptor loops
    const response = await axios.post(
      `${API_BASE}/auth/refresh-token?refreshToken=${refreshToken}`
    );
    // Update tokens in localStorage
    localStorage.setItem('authToken', response.data.idToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};
// Logout function to clear tokens
export const logout = (apiClient: AxiosInstance): void => {
  // Remove tokens from localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  // Clear auth header
  setAuthHeader(apiClient, null);
  // Clear subscribers
  refreshSubscribers = [];
  isRefreshing = false;
};
// Setup request interceptor to add auth token
const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    config => {
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
// Setup response interceptor to handle token expiration
const setupResponseInterceptor = (instance: AxiosInstance): void => {
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
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          logout(instance);
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
          logout(instance);
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
};
// Validate token on page load/refresh
export const validateTokenOnLoad = async (
  apiClient: AxiosInstance
): Promise<boolean> => {
  const currentToken = getAuthToken();
  const refreshToken = getRefreshToken();
  if (!currentToken) {
    return false;
  }
  // Set current token in headers
  setAuthHeader(apiClient, currentToken);
  try {
    // Try to make a request to verify the token is valid
    await apiClient.get(`${API_BASE}/auth/validate-token`);
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
        logout(apiClient);
        return false;
      }
    } else {
      // No refresh token available, log out
      logout(apiClient);
      return false;
    }
  }
};
// Create and configure axios instance with interceptors
export const createAxiosInstance = (baseURL = API_BASE): AxiosInstance => {
  // Create axios instance
  const instance = axios.create({
    baseURL,
  });
  // Setup interceptors
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
  return instance;
};
// Create default API client
const apiClient = createAxiosInstance();
// Export the default apiClient to use throughout the application
export default apiClient;

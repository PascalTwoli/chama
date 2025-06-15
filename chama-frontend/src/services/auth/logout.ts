import apiClient from '../../config/axios-config';
import SecureAuthService from './secure-auth-service';

/**
 * Secure logout function that uses the new secure authentication service
 * This function is maintained for backward compatibility but now uses secure storage
 */
const logoutUser = async (): Promise<void> => {
  try {
    // Use the secure auth service for logout
    await SecureAuthService.signOut();

    console.log('Secure logout completed successfully');
  } catch (error) {
    console.error('Logout failed:', error);

    // Even if API call fails, clear local tokens for security
    try {
      await SecureAuthService.signOut();
    } catch (fallbackError) {
      console.error('Fallback logout also failed:', fallbackError);
    }
  } finally {
    // Use window.location for a full page refresh to clear any remaining state
    window.location.href = '/signin';
  }
};

/**
 * Alternative secure logout that doesn't redirect (for programmatic use)
 */
export const secureLogoutWithoutRedirect = async (): Promise<void> => {
  try {
    await SecureAuthService.signOut();
    console.log('Secure logout completed without redirect');
  } catch (error) {
    console.error('Secure logout failed:', error);
    throw error;
  }
};

export default logoutUser;

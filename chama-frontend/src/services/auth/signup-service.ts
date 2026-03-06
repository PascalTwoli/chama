import { AxiosError, AxiosResponse } from 'axios';
import apiClient, { setAuthHeader } from '../../config/axios-config';
import {
  SignupRequest,
  SignupResponse,
  ApiErrorResponse,
  User,
  OnboardingStatus,
} from '../../models/user';
import { UserType } from '../../data/user-type';
import SecureTokenStorage from '../../utils/secure-token-storage';

export class AuthService {
  static normalizeUserType(
    userType: UserType | string | null
  ): UserType | null {
    if (!userType) return null;
    const typeStr = userType.toString().toUpperCase();
    return typeStr === UserType.ADMIN.toString()
      ? UserType.ADMIN
      : typeStr === UserType.MEMBER.toString()
        ? UserType.MEMBER
        : null;
  }

  static async signup(userData: SignupRequest): Promise<SignupResponse> {
    try {
      const response: AxiosResponse<SignupResponse & { idToken?: string }> =
        await apiClient.post('/auth/signup', userData);

      // Store auth token if provided in response (backend returns idToken)
      const authToken = response.data.idToken || response.data.token;
      if (authToken) {
        SecureTokenStorage.setAuthToken(authToken);
        setAuthHeader(apiClient, authToken);
      }

      console.log('Sign-up successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const statusCode = axiosError.response?.status;
      const errorResponse = axiosError.response?.data;
      let errorMessage =
        errorResponse?.message || 'Registration failed. Please try again.';
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      if (
        statusCode === 409 ||
        (errorMessage.includes('email') && errorMessage.includes('exist'))
      ) {
        throw new Error(
          'Email is already registered. Please use a different email or sign in.'
        );
      }
      throw new Error(errorMessage);
    }
  }

  static async updateUserType(
    userId: string,
    user: Partial<User>
  ): Promise<User> {
    console.log('=== updateUserType called ===');
    console.log('userId:', userId);
    console.log('user data:', user);

    // Check if we have auth token
    const token = SecureTokenStorage.getAuthToken();
    console.log('Auth token exists:', !!token);
    console.log(
      'Auth token (first 50 chars):',
      token ? token.substring(0, 50) + '...' : 'null'
    );

    try {
      console.log('Making PATCH request to:', `/user/${userId}`);
      // Token is automatically added by axios interceptor
      const response: AxiosResponse<User> = await apiClient.patch(
        `/user/${userId}`,
        user
      );
      console.log('updateUserType response:', response.data);
      return response.data;
    } catch (error) {
      console.error('updateUserType error:', error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Error response status:', axiosError.response.status);
        console.error('Error response data:', axiosError.response.data);
        console.error('Error response headers:', axiosError.response.headers);
      }
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User> {
    const token = SecureTokenStorage.getAuthToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      // Backend returns UserResponseEntity, not User directly
      // Headers handled by interceptor, but explicit header doesn't hurt if we have token
      const response: AxiosResponse<{
        firebaseUser?: {
          uid?: string;
          email?: string;
          phoneNumber?: string;
          emailVerified?: boolean;
        };
        localUser?: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          activeUserType?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      }> = await apiClient.get('/auth/me');

      // Extract user data from the backend response structure
      const { firebaseUser, localUser } = response.data;

      //create a User object that matches the frontend interface
      //use firebaseUser.uid as the primary ID since that's what backend expects
      const user: User = {
        id: firebaseUser?.uid || localUser?.id || '', // Use Firebase UID as primary ID
        firstName: localUser?.name?.split(' ')[0] || '',
        lastName: localUser?.name?.split(' ').slice(1).join(' ') || '',
        email: firebaseUser?.email || localUser?.email || '',
        phoneNumber: firebaseUser?.phoneNumber || localUser?.phone || '',
        activeUserType:
          (localUser?.activeUserType as UserType) || UserType.MEMBER,
        createdAt: localUser?.createdAt,
        updatedAt: localUser?.updatedAt,
        isEmailVerified: firebaseUser?.emailVerified || false,
      };

      return user;
    } catch (error) {
      console.error('getCurrentUser error:', error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Error response status:', axiosError.response.status);
        console.error('Error response data:', axiosError.response.data);
      }
      throw error;
    }
  }

  static async getUserType(_forceCheck = false): Promise<UserType | null> {
    try {
      const user = await this.getCurrentUser();
      return this.normalizeUserType(user.activeUserType);
    } catch (error) {
      console.error('Error fetching user type:', error);
      return null;
    }
  }

  static async checkOnboardingStatus(): Promise<OnboardingStatus> {
    try {
      const user = await this.getCurrentUser();
      const needsUserType = !user.activeUserType;
      let needsChama = false;
      if (user.activeUserType === UserType.ADMIN) {
        needsChama = localStorage.getItem('hasCreatedChama') !== 'true';
      } else if (user.activeUserType === UserType.MEMBER) {
        needsChama = localStorage.getItem('hasJoinedChama') !== 'true';
      }
      return {
        needsUserType,
        needsChama,
        activeUserType: user.activeUserType
          ? this.normalizeUserType(user.activeUserType)
          : null,
        needsProfileCompletion: false,
        needsVerification: false,
        needsSetup: false,
      };
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      throw new Error('Failed to check onboarding status');
    }
  }

  static getRedirectPath(): string {
    const authToken = SecureTokenStorage.getAuthToken();
    if (!authToken) {
      return '/signin';
    }
    return '/chose-user'; // Simplified, as actual path depends on async check now
  }

  static markChamaCreationComplete(chamaId: string): void {
    localStorage.setItem('hasCreatedChama', 'true');
    localStorage.setItem('activeChamaId', chamaId);
  }

  static markChamaJoiningComplete(chamaId: string): void {
    localStorage.setItem('hasJoinedChama', 'true');
    localStorage.setItem('activeChamaId', chamaId);
  }
}

export default AuthService;

import { AxiosError, AxiosResponse } from 'axios';
import apiClient from '../config/axios-config';
import {
  Chama,
  ChamaResponse,
  ExtendedChamaFormData,
  JoinChamaResponse,
} from '../models/chamas';

// Additional interfaces for API responses
interface UserChamasResponse {
  chamas: Chama[];
  success: boolean;
  message: string;
  error?: string;
}

interface InviteValidationResponse {
  valid: boolean;
  chama?: {
    id: string;
    name: string;
    description?: string;
  };
  success: boolean;
  message: string;
  error?: string;
}

interface InviteAcceptanceResponse {
  success: boolean;
  message: string;
  chamaId?: string;
  error?: string;
}

interface InviteCreationResponse {
  success: boolean;
  message: string;
  inviteToken?: string;
  error?: string;
}

export class ChamaService {
  static normalizeChamaType(chamaType: string | null): string | null {
    if (!chamaType) return null;
    const typeStr = chamaType.toUpperCase();
    return typeStr === 'SAVINGS' || typeStr === 'INVESTMENT' ? typeStr : null;
  }

  //create a new chama for a user
  static async createNewChama(data: ExtendedChamaFormData): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        '/chama',
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      // Backend returns the chama object directly with id, name, etc.
      return response.data;
    } catch (error) {
      console.error('Error creating chama:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to create chama.');
    }
  }

  static async getChamaById(chamaId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.get(
        `/chama/${chamaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching chama by ID:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to fetch chama details.');
    }
  }

  //chamas that a user is part of/belongs to
  static async getUserChamas(): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await apiClient.get('/chama');
      return response.data;
    } catch (error) {
      console.error('Error fetching user chamas:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to fetch user chamas.');
    }
  }

  static async fetchAllChamas(): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> =
        await apiClient.get('/chama/available');
      return response.data;
    } catch (error) {
      console.error('Error fetching all chamas:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to fetch chamas.');
    }
  }

  static async requestToJoinChama(
    chamaId: string,
    role: string,
    termsAccepted: boolean
  ): Promise<JoinChamaResponse> {
    try {
      if (!termsAccepted) {
        throw new Error(
          'You need to accept terms before requesting to join a chama.'
        );
      }

      const response: AxiosResponse<any> = await apiClient.post(
        `/chamas/${chamaId}/request`,
        {
          termsAccepted,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting to join chama:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to request to join chama.');
    }
  }

  static async joinChama(chamaId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        `/api/chamas/${chamaId}/join`
      );
      return response.data;
    } catch (error) {
      console.error('Error joining chama:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to join chama.');
    }
  }

  static async validateInvite(token: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.get(
        `/api/invites/validate/${token}`
      );
      return response.data;
    } catch (error) {
      console.error('Error validating invite:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to validate invite.');
    }
  }

  static async acceptInvite(token: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        `/api/invites/accept/${token}`
      );
      return response.data;
    } catch (error) {
      console.error('Error accepting invite:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to accept invite.');
    }
  }

  static async createInvite(
    chamaId: string,
    email: string,
    sendEmail = false
  ): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        '/api/invites/create',
        {
          chamaId,
          email,
          sendEmail,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating invite:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || 'Failed to create invite.');
    }
  }
}

export default ChamaService;

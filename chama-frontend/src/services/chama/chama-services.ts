import { AxiosError, AxiosResponse } from 'axios';
import apiClient from '../../config/axios-config';
import {
  Chama,
  ExtendedChamaFormData,
  JoinChamaResponse,
} from '../../models/chamas';

// Response type for API calls
interface ApiErrorData {
  message?: string;
}

export class ChamaService {
  static normalizeChamaType(chamaType: string | null): string | null {
    if (!chamaType) return null;
    const typeStr = chamaType.toUpperCase();
    return typeStr === 'SAVINGS' || typeStr === 'INVESTMENT' ? typeStr : null;
  }

  //create a new chama for a user
  static async createNewChama(data: ExtendedChamaFormData): Promise<Chama> {
    try {
      const response: AxiosResponse<Chama> = await apiClient.post(
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
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to create chama.');
    }
  }

  static async getChamaById(chamaId: string): Promise<Chama> {
    try {
      const response: AxiosResponse<Chama> = await apiClient.get(
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
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch chama details.');
    }
  }

  //chamas that a user is part of/belongs to
  static async getUserChamas(): Promise<Chama[]> {
    try {
      const response: AxiosResponse<Chama[]> = await apiClient.get('/chama');
      return response.data;
    } catch (error) {
      console.error('Error fetching user chamas:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch user chamas.');
    }
  }

  static async fetchAllChamas(): Promise<Chama[]> {
    try {
      const response: AxiosResponse<Chama[]> =
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
      const errorData = axiosError.response.data as ApiErrorData;
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

      const response: AxiosResponse<JoinChamaResponse> = await apiClient.post(
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
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to request to join chama.');
    }
  }

  static async joinChama(chamaId: string): Promise<JoinChamaResponse> {
    try {
      const response: AxiosResponse<JoinChamaResponse> = await apiClient.post(
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
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to join chama.');
    }
  }

  static async validateInvite(
    token: string
  ): Promise<{ valid: boolean; chama?: { id: string; name: string } }> {
    try {
      const response: AxiosResponse<{
        valid: boolean;
        chama?: { id: string; name: string };
      }> = await apiClient.get(`/api/invites/validate/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error validating invite:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to validate invite.');
    }
  }

  static async acceptInvite(
    token: string
  ): Promise<{ success: boolean; chamaId?: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; chamaId?: string }> =
        await apiClient.post(`/api/invites/accept/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error accepting invite:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to accept invite.');
    }
  }

  static async createInvite(
    chamaId: string,
    email: string,
    sendEmail = false
  ): Promise<{ inviteLink: string; inviteToken?: string }> {
    try {
      const response: AxiosResponse<{
        inviteLink: string;
        inviteToken?: string;
      }> = await apiClient.post('/api/invites/create', {
        chamaId,
        email,
        sendEmail,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating invite:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to create invite.');
    }
  }

  static async listPendingInvites(
    chamaId: string
  ): Promise<
    { id: string; email: string; status: string; createdAt: string }[]
  > {
    try {
      const response: AxiosResponse<
        { id: string; email: string; status: string; createdAt: string }[]
      > = await apiClient.get(`/api/invites/chama/${chamaId}`);
      return response.data;
    } catch (error) {
      console.error('Error listing pending invites:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to list pending invites.');
    }
  }
}

export default ChamaService;

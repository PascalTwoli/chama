import { AxiosError } from 'axios';
import secureApiClient from '../../interceptors/secure-api-interceptor';

interface ApiErrorData {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ChamaMemberUser {
  id: string;
  name: string | null;
  email: string | null;
  phone?: string | null;
}

export interface ChamaMember {
  id: string;
  userId: string;
  role: string;
  orgRole: { id: string; name: string } | null;
  joinedAt: string;
  user: ChamaMemberUser;
}

class ChamaMembersService {
  static async getChamaMembers(chamaId: string): Promise<ChamaMember[]> {
    try {
      const response = await secureApiClient.get(`/chama/${chamaId}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chama members:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch chama members.');
    }
  }
}

export default ChamaMembersService;

import { AxiosError } from 'axios';
import secureApiClient from '../../interceptors/secure-api-interceptor';

interface ApiErrorData {
  message?: string;
  error?: string;
  statusCode?: number;
}

export type ContributionModel = 'FIXED' | 'FLEXIBLE';
export type ContributionFrequency = 'MONTHLY' | 'WEEKLY';

export interface ChamaSettings {
  id: string;
  chamaId: string;
  contributionModel: ContributionModel;
  contributionAmount: number | null;
  frequency: ContributionFrequency | null;
  dueDay: number | null;
  gracePeriodDays: number | null;
  latePaymentFee: number | null;
  minimumContribution: number | null;
  contributionGuidelines: string | null;
  requireMeetingAttendance: boolean;
  enableMemberLoans: boolean;
  automaticSmsReminders: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateChamaSettingsDto = {
  contributionModel: ContributionModel;
  contributionAmount?: number;
  frequency?: ContributionFrequency;
  dueDay?: number;
  gracePeriodDays?: number;
  latePaymentFee?: number;
  minimumContribution?: number;
  contributionGuidelines?: string;
  requireMeetingAttendance?: boolean;
  enableMemberLoans?: boolean;
  automaticSmsReminders?: boolean;
};

export type UpdateChamaSettingsDto = Partial<CreateChamaSettingsDto>;

class ChamaSettingsService {
  static async getSettings(chamaId: string): Promise<ChamaSettings> {
    try {
      const response = await secureApiClient.get(`/chamas/${chamaId}/settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chama settings:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw Object.assign(
        new Error(errorData?.message || 'Failed to fetch chama settings.'),
        { response: axiosError.response }
      );
    }
  }

  static async createSettings(
    chamaId: string,
    data: CreateChamaSettingsDto
  ): Promise<ChamaSettings> {
    try {
      const response = await secureApiClient.post(
        `/chamas/${chamaId}/settings`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error creating chama settings:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw Object.assign(
        new Error(errorData?.message || 'Failed to create chama settings.'),
        { response: axiosError.response }
      );
    }
  }

  static async updateSettings(
    chamaId: string,
    data: UpdateChamaSettingsDto
  ): Promise<ChamaSettings> {
    try {
      const response = await secureApiClient.put(
        `/chamas/${chamaId}/settings`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating chama settings:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw Object.assign(
        new Error(errorData?.message || 'Failed to update chama settings.'),
        { response: axiosError.response }
      );
    }
  }
}

export default ChamaSettingsService;

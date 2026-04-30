import { AxiosError } from 'axios';
import secureApiClient from '../../interceptors/secure-api-interceptor';

interface ApiErrorData {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface TreasurySummary {
  treasuryBalance: number;
  totalContributions: number;
  totalExpenses: number;
  totalLoansDisbursed: number;
  totalLoanRepayments: number;
  totalInterestEarned: number;
}

class TreasuryService {
  static async getTreasurySummary(chamaId: string): Promise<TreasurySummary> {
    try {
      const response = await secureApiClient.get('/treasury/summary', {
        params: { chamaId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching treasury summary:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch treasury summary.');
    }
  }
}

export default TreasuryService;

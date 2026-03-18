import { AxiosError } from 'axios';
import secureApiClient from '../../interceptors/secure-api-interceptor';

interface ApiErrorData {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface DashboardData {
  totalSavings: number;
  totalMembers: number;
  thisMonthTotal: number;
  pendingPaymentsCount: number;
  monthlyContributions: { month: string; amount: number }[];
  contributionDistribution: { name: string; value: number; color: string }[];
  recentContributions: {
    id: string;
    userId: string;
    name: string;
    date: string;
    amount: number;
    status: string;
  }[];
  membersOverview: {
    id: string;
    name: string;
    phone: string;
    savings: number;
    status: string;
    lastPaymentDate: string | null;
    lastPaymentAmount: number | null;
    averageMonthly: number;
    totalTransactions: number;
  }[];
}

class DashboardService {
  static async getDashboard(chamaId: string): Promise<DashboardData> {
    try {
      const response = await secureApiClient.get(
        `/dashboard/chama/${chamaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(
        errorData?.message || 'Failed to fetch dashboard data.'
      );
    }
  }
}

export default DashboardService;

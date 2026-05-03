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
  treasuryBalance: number;
  outstandingLoans: number;
  defaultedLoansCount: number;
  thisMonthExpenses: number;
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

interface FinanceSummaryResponse {
  treasuryBalance: number;
  outstandingLoans: number;
  defaultedLoansCount: number;
}

interface ExpenseStatsResponse {
  thisMonthExpenses: number;
}

class DashboardService {
  static async getDashboard(chamaId: string): Promise<DashboardData> {
    try {
      const [dashboardResponse, financeResponse, expenseStatsResponse] =
        await Promise.all([
          secureApiClient.get(`/dashboard/chama/${chamaId}`),
          secureApiClient.get(`/finance/summary?chamaId=${chamaId}`),
          secureApiClient.get(`/expenses/stats?chamaId=${chamaId}`),
        ]);

      const financeSummary = financeResponse.data as FinanceSummaryResponse;
      const expenseStats = expenseStatsResponse.data as ExpenseStatsResponse;

      return {
        ...(dashboardResponse.data as DashboardData),
        treasuryBalance: financeSummary.treasuryBalance ?? 0,
        outstandingLoans: financeSummary.outstandingLoans ?? 0,
        defaultedLoansCount: financeSummary.defaultedLoansCount ?? 0,
        thisMonthExpenses: expenseStats.thisMonthExpenses ?? 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch dashboard data.');
    }
  }
}

export default DashboardService;

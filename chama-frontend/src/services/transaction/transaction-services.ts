import secureApiClient from '../../interceptors/secure-api-interceptor';
import { AxiosError } from 'axios';

interface ApiErrorData {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface Transaction {
  id: string;
  type:
    | 'CONTRIBUTION'
    | 'WITHDRAWAL'
    | 'LOAN'
    | 'LOAN_REPAYMENT'
    | 'FINE'
    | 'INTEREST';
  amount: number;
  chamaId: string;
  userId: string;
  description?: string;
  reference?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  // Extended fields that may come from joined data
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateTransactionDto {
  chamaId: string;
  type:
    | 'CONTRIBUTION'
    | 'WITHDRAWAL'
    | 'LOAN'
    | 'LOAN_REPAYMENT'
    | 'FINE'
    | 'INTEREST';
  amount: number;
  description?: string;
  reference?: string;
  userId?: string; // Optional: for admin recording transactions for other members
}

export interface TransactionSummary {
  totalContributions: number;
  totalWithdrawals: number;
  totalLoans: number;
  totalLoanRepayments: number;
  balance: number;
  transactionCount: number;
}

class TransactionService {
  /**
   * Create a new transaction
   */
  static async createTransaction(
    data: CreateTransactionDto
  ): Promise<Transaction> {
    try {
      const response = await secureApiClient.post('/transactions', data);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to create transaction.');
    }
  }

  /**
   * Get all transactions for a chama
   */
  static async getTransactionsByChama(
    chamaId: string,
    options?: {
      type?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams();
      if (options?.type) params.append('type', options.type);
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);

      const queryString = params.toString();
      const url = `/transactions/chama/${chamaId}${queryString ? `?${queryString}` : ''}`;

      const response = await secureApiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch transactions.');
    }
  }

  /**
   * Get a transaction by ID
   */
  static async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await secureApiClient.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch transaction.');
    }
  }

  /**
   * Get user transaction summary
   */
  static async getUserTransactionSummary(): Promise<TransactionSummary> {
    try {
      const response = await secureApiClient.get('/transactions/user/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(
        errorData?.message || 'Failed to fetch transaction summary.'
      );
    }
  }
}

export default TransactionService;

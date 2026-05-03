import secureApiClient from '../../interceptors/secure-api-interceptor';
import { AxiosError } from 'axios';
import {
  Loan,
  PaginatedLoans,
  LoanStats,
  ApproveLoanDto,
  RejectLoanDto,
  DisburseLoanDto,
  RecordRepaymentDto,
  MarkDefaultedDto,
  AdminCreateLoanDto,
} from '../../models/loans';

interface ApiErrorData {
  message?: string;
  error?: string;
  statusCode?: number;
}

class LoansService {
  /**
   * Get loan statistics for a chama
   */
  static async getStats(chamaId: string): Promise<LoanStats> {
    try {
      const response = await secureApiClient.get('/loans/stats', {
        params: { chamaId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching loan stats:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch loan statistics.');
    }
  }

  /**
   * Get paginated list of loans
   */
  static async getLoans(
    chamaId: string,
    options?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      borrowerId?: string;
    }
  ): Promise<PaginatedLoans> {
    try {
      const params = new URLSearchParams();
      params.append('chamaId', chamaId);
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.status) params.append('status', options.status);
      if (options?.search) params.append('search', options.search);
      if (options?.borrowerId) params.append('borrowerId', options.borrowerId);

      const response = await secureApiClient.get('/loans', {
        params: Object.fromEntries(params),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching loans:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch loans.');
    }
  }

  /**
   * Get a single loan by ID
   */
  static async getLoanById(id: string): Promise<Loan> {
    try {
      const response = await secureApiClient.get(`/loans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch loan.');
    }
  }

  /**
   * Request a new loan
   */
  static async requestLoan(
    chamaId: string,
    amount: number,
    durationMonths: number,
    purpose?: string,
    notes?: string
  ): Promise<Loan> {
    try {
      const response = await secureApiClient.post('/loans/request', {
        chamaId,
        amount,
        durationMonths,
        purpose,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting loan:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to request loan.');
    }
  }

  /**
   * Move a loan from REQUESTED to UNDER_REVIEW
   */
  static async reviewLoan(loanId: string): Promise<Loan> {
    try {
      const response = await secureApiClient.patch(`/loans/${loanId}/review`);
      return response.data;
    } catch (error) {
      console.error('Error reviewing loan:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to move loan to review.');
    }
  }

  /**
   * Approve a loan
   */
  static async approveLoan(
    loanId: string,
    chamaId: string,
    approvedAmount: number,
    interestRate?: number,
    notes?: string
  ): Promise<Loan> {
    try {
      const response = await secureApiClient.patch(`/loans/${loanId}/approve`, {
        chamaId,
        approvedAmount,
        interestRate,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Error approving loan:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to approve loan.');
    }
  }

  /**
   * Reject a loan
   */
  static async rejectLoan(
    loanId: string,
    chamaId: string,
    reason?: string
  ): Promise<Loan> {
    try {
      const response = await secureApiClient.patch(`/loans/${loanId}/reject`, {
        chamaId,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting loan:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to reject loan.');
    }
  }

  /**
   * Disburse an approved loan
   */
  static async disburseLoan(loanId: string, startDate: string): Promise<Loan> {
    try {
      const response = await secureApiClient.patch(
        `/loans/${loanId}/disburse`,
        {
          startDate,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error disbursing loan:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to disburse loan.');
    }
  }

  /**
   * Record a repayment for a loan
   */
  static async recordRepayment(
    loanId: string,
    payload: RecordRepaymentDto
  ): Promise<Loan> {
    try {
      const response = await secureApiClient.post(
        `/loans/${loanId}/repayments`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error recording repayment:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to record repayment.');
    }
  }

  /**
   * Mark a loan as defaulted
   */
  static async markDefaulted(
    loanId: string,
    payload: MarkDefaultedDto
  ): Promise<Loan> {
    try {
      const response = await secureApiClient.patch(
        `/loans/${loanId}/default`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error marking loan as defaulted:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(
        errorData?.message || 'Failed to mark loan as defaulted.'
      );
    }
  }

  /**
   * Create a new loan (admin direct creation)
   */
  static async createLoan(payload: AdminCreateLoanDto): Promise<Loan> {
    try {
      const response = await secureApiClient.post('/loans', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating loan:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to create loan.');
    }
  }
}

export default LoansService;

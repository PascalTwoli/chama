import { AxiosError, AxiosResponse } from 'axios';
import apiClient from '../config/axios-config';
import {
  ExpenseResponseDto,
  PaginatedExpensesDto,
  ExpenseStatsDto,
  CreateExpenseDto,
  ExpenseCategory,
} from '../models/expenses';

interface ApiErrorData {
  message?: string;
}

export class ExpensesService {
  /**
   * Get paginated expenses for a chama
   */
  static async getExpenses(
    chamaId: string,
    page = 1,
    limit = 20,
    filters?: {
      categoryId?: string;
      dateFrom?: string;
      dateTo?: string;
      status?: string;
    }
  ): Promise<PaginatedExpensesDto> {
    try {
      const params = new URLSearchParams({
        chamaId,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.categoryId) {
        params.append('categoryId', filters.categoryId);
      }
      if (filters?.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters?.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }

      const response: AxiosResponse<PaginatedExpensesDto> = await apiClient.get(
        `/expenses?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch expenses.');
    }
  }

  /**
   * Get expense statistics for a chama
   */
  static async getExpenseStats(chamaId: string): Promise<ExpenseStatsDto> {
    try {
      const response: AxiosResponse<ExpenseStatsDto> = await apiClient.get(
        `/expenses/stats?chamaId=${chamaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching expense stats:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch expense stats.');
    }
  }

  /**
   * Create a new expense
   */
  static async createExpense(
    chamaId: string,
    data: CreateExpenseDto
  ): Promise<ExpenseResponseDto> {
    try {
      const response: AxiosResponse<ExpenseResponseDto> = await apiClient.post(
        `/expenses?chamaId=${chamaId}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating expense:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData & { message?: string | string[] };

      // Handle validation errors (Array format from NestJS)
      if (Array.isArray(errorData?.message)) {
        const validationErrors = (errorData.message as string[]).join(', ');
        throw new Error(`Validation error: ${validationErrors}`);
      }

      throw new Error(errorData?.message as string || 'Failed to create expense.');
    }
  }

  /**
   * Get a single expense by ID
   */
  static async getExpenseById(
    expenseId: string,
    chamaId: string
  ): Promise<ExpenseResponseDto> {
    try {
      const response: AxiosResponse<ExpenseResponseDto> = await apiClient.get(
        `/expenses/${expenseId}?chamaId=${chamaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching expense:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to fetch expense.');
    }
  }

  /**
   * Approve an expense
   */
  static async approveExpense(
    expenseId: string,
    chamaId: string
  ): Promise<ExpenseResponseDto> {
    try {
      const response: AxiosResponse<ExpenseResponseDto> = await apiClient.post(
        `/expenses/${expenseId}/approve?chamaId=${chamaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error approving expense:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to approve expense.');
    }
  }

  /**
   * Reject an expense
   */
  static async rejectExpense(
    expenseId: string,
    chamaId: string
  ): Promise<ExpenseResponseDto> {
    try {
      const response: AxiosResponse<ExpenseResponseDto> = await apiClient.post(
        `/expenses/${expenseId}/reject?chamaId=${chamaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error rejecting expense:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to reject expense.');
    }
  }

  /**
   * Upload attachment for an expense
   */
  static async uploadAttachment(
    expenseId: string,
    chamaId: string,
    file: File
  ): Promise<ExpenseResponseDto> {
    try {
      const formData = new FormData();
      formData.append('attachment', file);

      const response: AxiosResponse<ExpenseResponseDto> = await apiClient.post(
        `/expenses/${expenseId}/attachment?chamaId=${chamaId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(errorData?.message || 'Failed to upload attachment.');
    }
  }

  /**
   * Get all expense categories available for a chama
   */
  static async getCategories(chamaId: string): Promise<ExpenseCategory[]> {
    try {
      const response: AxiosResponse<ExpenseCategory[]> = await apiClient.get(
        `/expenses/categories?chamaId=${chamaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return default categories if fetch fails
      return [
        {
          id: '1',
          name: 'Administrative',
          createdAt: new Date().toISOString(),
        },
        { id: '2', name: 'Welfare', createdAt: new Date().toISOString() },
        { id: '3', name: 'Operations', createdAt: new Date().toISOString() },
        {
          id: '4',
          name: 'Reimbursements',
          createdAt: new Date().toISOString(),
        },
        { id: '5', name: 'Events', createdAt: new Date().toISOString() },
        { id: '6', name: 'Miscellaneous', createdAt: new Date().toISOString() },
      ];
    }
  }
}

import { AxiosError } from 'axios';
import secureApiClient from '../../interceptors/secure-api-interceptor';

interface ApiErrorData {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface Notification {
  id: string;
  userId: string;
  chamaId: string;
  typeId: string;
  audience: 'ADMIN' | 'MEMBER' | 'BOTH';
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  actionRequired: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface PaginatedNotifications {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  actionRequired: number;
}

export interface GetNotificationsParams {
  chamaId: string;
  page?: number;
  limit?: number;
  status?: 'all' | 'unread' | 'action';
  audience?: 'ADMIN' | 'MEMBER';
}

class NotificationsService {
  /**
   * Get paginated notifications for the current user in a chama
   */
  static async getNotifications(
    params: GetNotificationsParams
  ): Promise<PaginatedNotifications> {
    try {
      const response = await secureApiClient.get('/notifications', {
        params: {
          chamaId: params.chamaId,
          page: params.page || 1,
          limit: params.limit || 20,
          status: params.status || 'all',
          audience: params.audience,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(
        errorData?.message || 'Failed to fetch notifications.'
      );
    }
  }

  /**
   * Get notification statistics
   */
  static async getStats(
    chamaId: string,
    audience?: 'ADMIN' | 'MEMBER'
  ): Promise<NotificationStats> {
    try {
      const response = await secureApiClient.get('/notifications/stats', {
        params: {
          chamaId,
          audience,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(
        errorData?.message || 'Failed to fetch notification statistics.'
      );
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(
    notificationId: string,
    chamaId: string
  ): Promise<Notification> {
    try {
      const response = await secureApiClient.put(
        `/notifications/${notificationId}/read`,
        {},
        {
          params: { chamaId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(
        errorData?.message || 'Failed to mark notification as read.'
      );
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(chamaId: string): Promise<{ count: number }> {
    try {
      const response = await secureApiClient.put(
        '/notifications/read-all',
        {},
        {
          params: { chamaId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      const errorData = axiosError.response.data as ApiErrorData;
      throw new Error(
        errorData?.message || 'Failed to mark all notifications as read.'
        );
    }
  }
}

export default NotificationsService;

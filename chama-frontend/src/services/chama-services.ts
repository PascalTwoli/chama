import { AxiosError, AxiosResponse } from "axios";
import apiClient from "../config/axios-config";
import { CreateChamaResponse, ExtendedChamaFormData } from "../models/chamas";


export class ChamaService {
  static normalizeChamaType(chamaType: string | null): string | null {
    if (!chamaType) return null;
    const typeStr = chamaType.toUpperCase();
    return typeStr === 'SAVINGS' || typeStr === 'INVESTMENT' ? typeStr : null;
  }

static async getUserChamas(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.get('/api/chamas/user');
      return response.data;
    } catch (error) {
      console.error("Error fetching user chamas:", error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error("Could not connect to the server. Please check your internet connection and try again.");
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || "Failed to fetch user chamas.");
    }
  }

  static async createNewChama(data: ExtendedChamaFormData): Promise<CreateChamaResponse> {
    try {
      const response: AxiosResponse<CreateChamaResponse> = await apiClient.post('/chama', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating chama:", error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error("Could not connect to the server. Please check your internet connection and try again.");
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || "Failed to create chama.");
    }
  }

  static async joinChama(chamaId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(`/api/chamas/${chamaId}/join`);
      return response.data;
    } catch (error) {
      console.error("Error joining chama:", error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error("Could not connect to the server. Please check your internet connection and try again.");
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || "Failed to join chama.");
    }
  }

  static async validateInvite(token: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.get(`/api/invites/validate/${token}`);
      return response.data;
    } catch (error) {
      console.error("Error validating invite:", error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error("Could not connect to the server. Please check your internet connection and try again.");
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || "Failed to validate invite.");
    }
  }

  static async acceptInvite(token: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(`/api/invites/accept/${token}`);
      return response.data;
    } catch (error) {
      console.error("Error accepting invite:", error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error("Could not connect to the server. Please check your internet connection and try again.");
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || "Failed to accept invite.");
    }
  }
  
  static async createInvite(chamaId: string, email: string, sendEmail: boolean = false): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post('/api/invites/create', {
        chamaId,
        email,
        sendEmail
      });
      return response.data;
    } catch (error) {
      console.error("Error creating invite:", error);
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        throw new Error("Could not connect to the server. Please check your internet connection and try again.");
      }
      const errorData = axiosError.response.data as { message?: string };
      throw new Error(errorData?.message || "Failed to create invite.");
    }
  }

}




import { AxiosError } from 'axios';
import secureApiClient from '../../interceptors/secure-api-interceptor';

interface ApiErrorData {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface RolePermission {
  permission_id: string;
  permission: {
    id: string;
    key: string;
    description: string | null;
  };
}

export interface Role {
  id: string;
  chama_id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  createdAt: string;
  role_permissions: RolePermission[];
  _count?: { member_roles: number };
}

export interface Permission {
  id: string;
  key: string;
  description: string | null;
}

export interface PermissionsMatrix {
  roles: {
    id: string;
    name: string;
    description: string | null;
    is_default: boolean;
  }[];
  permissions: {
    id: string;
    key: string;
    description: string | null;
  }[];
  matrix: Record<string, Record<string, boolean>>;
}

export type RoleStats = Record<string, number>;

export interface MemberRoleAssignment {
  user_id: string;
  chama_id: string;
  role_id: string;
  role: {
    id: string;
    name: string;
  };
}

function handleError(error: unknown, fallbackMsg: string): never {
  console.error(fallbackMsg, error);
  const axiosError = error as AxiosError;
  if (!axiosError.response) {
    throw new Error(
      'Could not connect to the server. Please check your internet connection and try again.'
    );
  }
  const errorData = axiosError.response.data as ApiErrorData;
  throw new Error(errorData?.message || fallbackMsg);
}

class RolesPermissionsService {
  static async getRoles(chamaId: string): Promise<Role[]> {
    try {
      const response = await secureApiClient.get(
        `/roles?chamaId=${chamaId}`
      );
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch roles.');
    }
  }

  static async getPermissions(): Promise<Permission[]> {
    try {
      const response = await secureApiClient.get('/permissions');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch permissions.');
    }
  }

  static async getPermissionsMatrix(
    chamaId: string
  ): Promise<PermissionsMatrix> {
    try {
      const response = await secureApiClient.get(
        `/roles/permissions-matrix?chamaId=${chamaId}`
      );
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch permissions matrix.');
    }
  }

  static async getRoleStats(chamaId: string): Promise<RoleStats> {
    try {
      const response = await secureApiClient.get(
        `/roles/stats?chamaId=${chamaId}`
      );
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch role stats.');
    }
  }

  static async createRole(
    chamaId: string,
    data: { name: string; description?: string; permissions: string[] }
  ): Promise<Role> {
    try {
      const response = await secureApiClient.post(
        `/roles?chamaId=${chamaId}`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create role.');
    }
  }

  static async updateRole(
    roleId: string,
    chamaId: string,
    data: { name?: string; description?: string; permissions?: string[] }
  ): Promise<Role> {
    try {
      const response = await secureApiClient.put(
        `/roles/${roleId}?chamaId=${chamaId}`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update role.');
    }
  }

  static async deleteRole(
    roleId: string,
    chamaId: string
  ): Promise<void> {
    try {
      await secureApiClient.delete(
        `/roles/${roleId}?chamaId=${chamaId}`
      );
    } catch (error) {
      handleError(error, 'Failed to delete role.');
    }
  }

  static async assignMemberRole(
    memberId: string,
    chamaId: string,
    roleId: string
  ): Promise<MemberRoleAssignment> {
    try {
      const response = await secureApiClient.put(
        `/members/${memberId}/role`,
        { chamaId, roleId }
      );
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to assign role.');
    }
  }
}

export default RolesPermissionsService;

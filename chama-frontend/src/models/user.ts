import { UserType } from '../data/user-type';

// Define UserAppMetadata interface or import it if defined elsewhere
export interface UserAppMetadata {
  // Add properties as needed, for example:
  permissions?: string[];
  provider?: string;
  [key: string]: any; // Allow additional properties
}

export interface UserMetadata {
  [key: string]: unknown;
}

// ==================== ROLE SYSTEM ====================

/**
 * System Roles - Control what someone can do in the system
 * OWNER: Creator of the chama, immutable, full authority
 * ADMIN: Appointed by owner, operational management
 * MEMBER: Normal participant
 */
export type SystemRole = 'OWNER' | 'ADMIN' | 'MEMBER';

/**
 * Governance Roles - Reflect real-world leadership positions
 * These are labels + scoped permissions, can change over time
 */
export type GovernanceRole =
  | 'CHAIRPERSON'
  | 'VICE_CHAIR'
  | 'SECRETARY'
  | 'TREASURER'
  | 'WELFARE_OFFICER'
  | null;

/**
 * Permission Flags - Scoped access control
 * Permissions > Roles (what you can actually do)
 */
export interface PermissionFlags {
  // Member management
  manageMembers: boolean;
  approveJoinRequests: boolean;
  inviteMembers: boolean;

  // Financial operations
  manageFinance: boolean;
  recordContributions: boolean;
  approvePayouts: boolean;

  // Reporting & records
  viewReports: boolean;
  editRecords: boolean;

  // Chama configuration
  editChamaSettings: boolean;
  editChamaRules: boolean;

  // Owner-only powers (immutable)
  deleteChama: boolean;
  transferOwnership: boolean;
  assignAdmins: boolean;
}

/**
 * Default permissions by system role
 */
export const DEFAULT_PERMISSIONS: Record<SystemRole, PermissionFlags> = {
  OWNER: {
    manageMembers: true,
    approveJoinRequests: true,
    inviteMembers: true,
    manageFinance: true,
    recordContributions: true,
    approvePayouts: true,
    viewReports: true,
    editRecords: true,
    editChamaSettings: true,
    editChamaRules: true,
    deleteChama: true,
    transferOwnership: true,
    assignAdmins: true,
  },
  ADMIN: {
    manageMembers: true,
    approveJoinRequests: true,
    inviteMembers: true,
    manageFinance: false,
    recordContributions: true,
    approvePayouts: false,
    viewReports: true,
    editRecords: true,
    editChamaSettings: false,
    editChamaRules: false,
    deleteChama: false,
    transferOwnership: false,
    assignAdmins: false,
  },
  MEMBER: {
    manageMembers: false,
    approveJoinRequests: false,
    inviteMembers: false,
    manageFinance: false,
    recordContributions: false,
    approvePayouts: false,
    viewReports: false,
    editRecords: false,
    editChamaSettings: false,
    editChamaRules: false,
    deleteChama: false,
    transferOwnership: false,
    assignAdmins: false,
  },
};

/**
 * Permission overrides by governance role
 * These extend/modify the base system role permissions
 */
export const GOVERNANCE_PERMISSION_OVERRIDES: Record<
  Exclude<GovernanceRole, null>,
  Partial<PermissionFlags>
> = {
  CHAIRPERSON: {
    manageMembers: true,
    editChamaSettings: true,
    editChamaRules: true,
    approvePayouts: true,
  },
  VICE_CHAIR: {
    manageMembers: true,
    approveJoinRequests: true,
  },
  SECRETARY: {
    editRecords: true,
    viewReports: true,
  },
  TREASURER: {
    manageFinance: true,
    recordContributions: true,
    approvePayouts: true,
    viewReports: true,
  },
  WELFARE_OFFICER: {
    viewReports: true,
  },
};

/**
 * Compute effective permissions for a user
 */
export function computePermissions(
  systemRole: SystemRole,
  governanceRole: GovernanceRole
): PermissionFlags {
  // Start with base permissions from system role
  const basePermissions = { ...DEFAULT_PERMISSIONS[systemRole] };

  // OWNER always gets everything - governance role doesn't limit them
  if (systemRole === 'OWNER') {
    return basePermissions;
  }

  // Apply governance role overrides if applicable
  if (governanceRole && GOVERNANCE_PERMISSION_OVERRIDES[governanceRole]) {
    const overrides = GOVERNANCE_PERMISSION_OVERRIDES[governanceRole];
    return { ...basePermissions, ...overrides };
  }

  return basePermissions;
}

// ==================== CHAMA MEMBERSHIP ====================

/**
 * Chama membership for a user
 * Updated to follow foundational role structure
 */
export interface ChamaMembership {
  chamaId: string;
  chamaName: string;
  systemRole: SystemRole;
  governanceRole: GovernanceRole;
  permissions: PermissionFlags;
  isActive: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  joinedAt?: string;
  isOwner?: boolean; // Convenience flag
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  activeUserType: UserType;
  chamas?: ChamaMembership[]; // User's chama memberships
  activeChama?: ChamaMembership; // Currently active chama
  profilepic?: string; // Optional profile picture field
  app_metadata?: UserAppMetadata;
  metadata?: UserMetadata; // Optional metadata field
  createdAt?: string;
  updatedAt?: string;
  isFirstTimeUser?: boolean; // Optional field to indicate if it's the user's first time
  role?: string; // Optional field for user role
  lastLogin?: string; // Optional field for last login timestamp
  invitedBy?: string; // Optional field for the user who invited this user
  isEmailVerified?: boolean; // Optional field to indicate if the user's email is verified
  isPhoneNumberVerified?: boolean; // Optional field to indicate if the user's phone number is verified
  isActive?: boolean; // Optional field to indicate if the user is active
  confirmedAt?: string; // Optional field for confirmation timestamp
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  idToken?: string; // API returns idToken
  token?: string; // Fallback for compatibility
  refreshToken: string;
  expiresIn?: number;
  user: User;
}

//Signup request interfaces
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

//Signup response interfaces
export interface SignupResponse {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  message?: string;
  token?: string;
  userId: string;
}

// Interface for form errors
export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  [key: string]: string | undefined;
}

// API error response interface
export interface ApiErrorResponse {
  message: string | string[];
  statusCode?: number;
  error?: string;
  errors?: Array<{ message: string; field?: string }>; //handle structured validation errors
}

export interface OnboardingStatus {
  needsUserType: boolean;
  needsProfileCompletion: boolean;
  needsVerification: boolean;
  needsSetup: boolean;
  needsChama: boolean;
  activeUserType: UserType | null;
}

export enum UserRole {
  CHAIRPERSON = 'CHAIRPERSON',
  SECRETARY = 'SECRETARY',
  TREASURER = 'TREASURER',
  MEMBER = 'MEMBER',
}

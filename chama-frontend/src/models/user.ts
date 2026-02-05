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

// Chama membership for a user
export interface ChamaMembership {
  chamaId: string;
  chamaName: string;
  role: 'ADMIN' | 'MEMBER';
  isActive: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  joinedAt?: string;
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

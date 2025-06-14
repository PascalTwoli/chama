import { UserType } from '../data/user-type';

// Define UserAppMetadata interface or import it if defined elsewhere
export interface UserAppMetadata {
  // Add properties as needed, for example:
  permissions?: string[];
  provider?: string;
  [key: string]: any; // Allow additional properties
}

export interface UserMetadata {
  [key: string]: any;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  activeUserType: UserType;
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
  token: string;
  refreshToken: string;
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

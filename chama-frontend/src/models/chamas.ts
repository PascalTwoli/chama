import { UserType } from '../data/user-type';
import { Countries } from './data/Countries';
import { User, UserRole } from './user';

export interface ChamaFormData {
  name: string;
  membersCount: number;
  location?: string;
  description: string;
  country: string;
  organizationRole: string;
  image?: File | null;
}

export interface Chama {
  id: string;
  userType: UserType;
  name: string;
  rules: string;
  userId: string;
  description?: string;
  organizationRole?: UserRole;
  country: Countries;
  image?: File | null; // or string if you store the URL
  members: User[];
  imageUrl: string;
  membersCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
}

export interface ChamaResponse {
  chamaId: Chama['id'];
  chama: {
    name: string;
    description?: string;
    imageUrl?: string; // URL to the chama's image
    membersCount?: number; // Total number of members in the chama
  };
  success: boolean;
  message: string;
  error?: string;
}

// Extended interface for complete form data including terms
export interface ExtendedChamaFormData extends ChamaFormData {
  rules: string;
}

//Interface for response when requesting to join a chama
export interface JoinChamaResponse {
  success: boolean;
  message: string;
  error?: string;
}

// what do i need to when joining a chama?
export interface JoinChamaFormData {
  chamaId: number;
  userId: number;
  role: string;
  termsAccepted: boolean;
  rules: string;
  image: File | null; // or string if you store the URL
}

export interface ChamaMember {
  id: number; // Unique identifier for the member
  userId: number;
  chamaId: number;
  role: string;
  joinedAt: string;
  imageUrl: string; // URL to the member's profile image
}

export interface ChamaMemberResponse {
  chamaId: number;
  members: ChamaMember[];
  success: boolean;
  message: string;
  error?: string;
}

//fetching chama details?
export interface ChamaDetails {
  chamaId: number;
  chamaName: string;
  description: string;
  imageUrl: string; // URL to the chama's image
  registrationDate: string;
  location: string;
  membersCount: number; // Total number of members in the chama
  members: ChamaMember[]; // List of members in the chama
  createdAt: string; // Date when the chama was created
  updatedAt: string; // Date when the chama was last updated
  userType: UserType; // Type of user (e.g., ADMIN, MEMBER)
  isMember: boolean; // Indicates if the current user is a member of the chama
  isAdmin: boolean; // Indicates if the current user is an admin of the chama
  isOwner: boolean; // Indicates if the current user is the owner of the chama
  owner: User; // Details of the owner of the chama
  terms: string; // Terms and conditions of the chama
  termsAccepted: boolean; // Indicates if the current user has accepted the terms
  termsAcceptedAt: string; // Date when the terms were accepted
  termsAcceptedBy: User | null; // User who accepted the terms, if applicable
  image: File | null; // or string if you store the URL
  imageFile: File | null; // File object for the chama's image
}

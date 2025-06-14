import { UserType } from '../data/user-type';
import { User } from './user';

export interface ChamaFormData {
  chamaName: string;
  membersCount: number;
  location: string;
  description: string;
  country: string;
  organizationRole: string;
  image: File | null;
}

export interface Chama {
  id: number;
  userType: UserType;
  name: string;
  location: string;
  registrationNumber: string;
  registrationDate: string;
  description: string;
  image: File | null; // or string if you store the URL
  members: User[];
  imageUrl: string;
  membersCount: number;
  createdAt: string;
  updatedAt: string;

}

export interface CreateChamaResponse {
  chamaId: string;
  chamaName: string;
  success: boolean;
  message: string;
  chama?: Chama;
  error?: string;

}

// Extended interface for complete form data including terms
export interface ExtendedChamaFormData extends ChamaFormData {
  terms: string;
}

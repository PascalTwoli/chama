import { UserType } from "../data/user-type";
import { User } from "./user";

export interface ChamaFormData {
  chamaName: string;
  membersCount: number;
  location: string;
  description: string;
  country: string;
  organizationRole: string;
  image: File | null;
}

export interface Chamas {
  id: number;
  userType: UserType
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
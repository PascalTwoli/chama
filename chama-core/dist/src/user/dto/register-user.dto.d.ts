import { UserType } from '@prisma/client';
export declare class RegisterUserDto {
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    password: string;
    activeUserType?: UserType;
}

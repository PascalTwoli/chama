import { UserType } from '@prisma/client';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
    password?: string;
    activeUserType?: UserType;
}

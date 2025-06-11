import { UserRole, UserType } from '../models';
export declare class CreateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: UserRole;
    activeUserType?: UserType;
    firebaseUid?: string;
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    activeUserType?: UserType;
}
export declare class LoginUserDto {
    identifier: string;
    password: string;
}
export declare class DtoValidationUtils {
    static isEmail(value: string): boolean;
    static isPhoneNumber(value: string): boolean;
    static isValidUserRole(role: string): role is UserRole;
    static isValidUserType(type: string): type is UserType;
    static normalizeEmail(email: string): string;
    static normalizeName(name: string): string;
}

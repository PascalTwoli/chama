export declare enum UserType {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN"
}
export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    phone?: string;
    password?: string;
    activeUserType?: UserType;
}
export interface FirebaseUserResponse {
    uid: string;
    email?: string;
    displayName?: string;
    phoneNumber?: string;
    emailVerified?: boolean;
}
export declare function updateUser(userId: string, updateData: UpdateUserDto, token: string): Promise<FirebaseUserResponse>;

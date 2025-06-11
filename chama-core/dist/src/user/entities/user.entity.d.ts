import { UserType } from '@prisma/client';
export declare class UserEntity {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    activeUserType?: UserType;
    createdAt: Date;
    updatedAt: Date;
    passwordHash?: string;
    constructor(partial: Partial<UserEntity>);
}
export declare class FirebaseUserEntity {
    uid: string;
    email?: string;
    displayName?: string;
    phoneNumber?: string;
    emailVerified?: boolean;
    constructor(partial: Partial<FirebaseUserEntity>);
}
export declare class UserResponseEntity {
    firebaseUser?: FirebaseUserEntity;
    localUser: UserEntity;
    constructor(partial: Partial<UserResponseEntity>);
}
export declare class User {
}

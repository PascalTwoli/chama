import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
export interface PaginationParams {
    maxResults?: number;
    pageToken?: string;
}
export interface UserListResponse {
    users: firebaseAdmin.auth.UserRecord[];
    pageToken?: string;
}
export interface EnhancedUserResponse {
    firebaseUser: firebaseAdmin.auth.UserRecord | null;
    localUser: UserEntity;
}
export interface LoginResponse {
    idToken: string;
    refreshToken: string;
    expiresIn: string;
    user: {
        firebaseUser: firebaseAdmin.auth.UserRecord | null;
        localUser: any;
    };
}
export declare class UserService {
    private databaseService;
    constructor(databaseService: PrismaService);
    updateUserType(uid: string, userType: UserType): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string | null;
            id: string;
            email: string | null;
            phone: string | null;
            passwordHash: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            activeUserType: import(".prisma/client").$Enums.UserType | null;
        };
    }>;
    registerUser(registerUser: RegisterUserDto): Promise<LoginResponse>;
    loginUser(payload: LoginDto): Promise<LoginResponse>;
    private signInWithEmailAndPassword;
    private sendPostRequest;
    validateRequestAndGetToken(req: any): Promise<firebaseAdmin.auth.DecodedIdToken | null>;
    refreshAuthToken(refreshToken: string): Promise<{
        idToken: any;
        refreshToken: any;
        expiresIn: any;
    }>;
    private sendRefreshAuthTokenRequest;
    findAll(params?: PaginationParams): Promise<UserListResponse>;
    findOne(uid: string): Promise<EnhancedUserResponse>;
    update(uid: string, updateUserDto: UpdateUserDto): Promise<firebaseAdmin.auth.UserRecord>;
    updateLocalUser(uid: string, updateData: Partial<UpdateUserDto>): Promise<UserEntity>;
    remove(uid: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

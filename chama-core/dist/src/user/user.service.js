"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const firebaseAdmin = require("firebase-admin");
const axios_1 = require("axios");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async updateUserType(uid, userType) {
        try {
            const { firebaseUser, localUser } = await this.findOne(uid);
            if (!localUser) {
                throw new common_1.NotFoundException(`User with ID ${uid} not found in local database`);
            }
            const updatedUser = await this.databaseService.user.update({
                where: { id: uid },
                data: { activeUserType: userType },
            });
            return {
                success: true,
                message: `User type updated to ${userType}`,
                user: updatedUser,
            };
        }
        catch (error) {
            console.error(`Error updating user type for ${uid}:`, error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update user type: ${error.message}`);
        }
    }
    async registerUser(registerUser) {
        console.log(registerUser);
        try {
            const userRecord = await firebaseAdmin.auth().createUser({
                displayName: `${registerUser.firstName} ${registerUser.lastName}`,
                email: registerUser.email,
                password: registerUser.password,
                phoneNumber: registerUser.phoneNumber,
            });
            console.log('Firebase User Record:', userRecord);
            const localUser = await this.databaseService.$transaction(async (prisma) => {
                const user = await prisma.user.create({
                    data: {
                        id: userRecord.uid,
                        email: registerUser.email,
                        name: `${registerUser.firstName} ${registerUser.lastName}`,
                        phone: registerUser.phoneNumber || '',
                    },
                });
                return user;
            });
            console.log('Local User Record:', localUser);
            const { email, password } = registerUser;
            const response = await this.signInWithEmailAndPassword(email, password);
            if (!response || !response.idToken) {
                throw new Error('Authentication failed after registration: Invalid response from Firebase');
            }
            const { idToken, refreshToken, expiresIn } = response;
            return {
                idToken,
                refreshToken,
                expiresIn,
                user: {
                    firebaseUser: userRecord,
                    localUser: localUser,
                },
            };
        }
        catch (error) {
            console.error('Error creating user:', error);
            if (error.code !== 'auth/email-already-exists' && error.firebaseUid) {
                try {
                    await firebaseAdmin.auth().deleteUser(error.firebaseUid);
                    console.log(`Rolled back Firebase user creation for UID: ${error.firebaseUid}`);
                }
                catch (deleteError) {
                    console.error('Error rolling back Firebase user creation:', deleteError);
                }
            }
            if (error.code === 'auth/email-already-exists') {
                throw new common_1.BadRequestException('Email address is already in use');
            }
            else if (error.code === 'auth/invalid-phone-number') {
                throw new common_1.BadRequestException('The phone number is invalid');
            }
            else if (error.code?.includes('prisma')) {
                throw new common_1.BadRequestException(`Database error: ${error.message}`);
            }
            throw new common_1.BadRequestException(`User registration failed: ${error.message}`);
        }
    }
    async loginUser(payload) {
        const { email, password } = payload;
        try {
            const response = await this.signInWithEmailAndPassword(email, password);
            if (!response || !response.idToken) {
                throw new Error('Authentication failed: Invalid response from Firebase');
            }
            const { idToken, refreshToken, expiresIn } = response;
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;
            const userDetails = await this.findOne(uid);
            if (!userDetails.firebaseUser) {
                throw new Error('Authentication failed: Firebase user not found after login');
            }
            return {
                idToken,
                refreshToken,
                expiresIn,
                user: {
                    firebaseUser: userDetails.firebaseUser,
                    localUser: userDetails.localUser,
                },
            };
        }
        catch (error) {
            if (error.message.includes('EMAIL_NOT_FOUND')) {
                throw new Error('User not found.');
            }
            else if (error.message.includes('INVALID_PASSWORD')) {
                throw new Error('Invalid password.');
            }
            else {
                throw new Error(`Authentication failed: ${error.message}`);
            }
        }
    }
    async signInWithEmailAndPassword(email, password) {
        if (!process.env.FIREBASE_API_KEY) {
            throw new Error('Firebase API key is not configured. Please set the FIREBASE_API_KEY environment variable.');
        }
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
        return await this.sendPostRequest(url, {
            email,
            password,
            returnSecureToken: true,
        });
    }
    async sendPostRequest(url, data) {
        try {
            const response = await axios_1.default.post(url, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        }
        catch (error) {
            console.error('API request failed:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                throw new Error(error.response.data?.error?.message || 'API request failed');
            }
            throw error;
        }
    }
    async validateRequestAndGetToken(req) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            console.log('Authorization header not provided.');
            return null;
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            console.log('Invalid authorization format. Expected "Bearer <token>".');
            return null;
        }
        try {
            console.log('Verifying token with Firebase Admin SDK...');
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
            console.log('Token verified successfully:', decodedToken);
            return decodedToken;
        }
        catch (error) {
            console.error('Token verification failed:', error.message);
            if (error.code === 'auth/id-token-expired') {
                console.error('Token has expired.');
            }
            else if (error.code === 'auth/invalid-id-token') {
                console.error('Invalid ID token provided.');
            }
            return null;
        }
    }
    async refreshAuthToken(refreshToken) {
        try {
            const { id_token: idToken, refresh_token: newRefreshToken, expires_in: expiresIn, } = await this.sendRefreshAuthTokenRequest(refreshToken);
            return {
                idToken,
                refreshToken: newRefreshToken,
                expiresIn,
            };
        }
        catch (error) {
            if (error.message.includes('INVALID_REFRESH_TOKEN')) {
                throw new Error(`Invalid refresh token: ${refreshToken}.`);
            }
            else {
                throw new Error('Failed to refresh token');
            }
        }
    }
    async sendRefreshAuthTokenRequest(refreshToken) {
        const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`;
        const payload = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        };
        return await this.sendPostRequest(url, payload);
    }
    async findAll(params) {
        try {
            const maxResults = params?.maxResults || 1000;
            const listUsersResult = await firebaseAdmin
                .auth()
                .listUsers(maxResults, params?.pageToken);
            return {
                users: listUsersResult.users,
                pageToken: listUsersResult.pageToken,
            };
        }
        catch (error) {
            console.error('Error listing users:', error);
            throw new common_1.BadRequestException(`Failed to fetch users: ${error.message}`);
        }
    }
    async findOne(uid) {
        try {
            const firebaseUser = await firebaseAdmin.auth().getUser(uid);
            const localUser = await this.databaseService.user.findFirst({
                where: {
                    OR: [
                        { id: uid },
                        ...(firebaseUser.email ? [{ email: firebaseUser.email }] : []),
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    passwordHash: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    activeUserType: true,
                },
            });
            if (!localUser && firebaseUser) {
                const newLocalUser = await this.databaseService.user.create({
                    data: {
                        id: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        name: firebaseUser.displayName || '',
                        phone: firebaseUser.phoneNumber || '',
                        activeUserType: 'MEMBER',
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        passwordHash: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                        activeUserType: true,
                    },
                });
                return {
                    firebaseUser,
                    localUser: newLocalUser,
                };
            }
            return {
                firebaseUser,
                localUser: localUser,
            };
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                const localUser = await this.databaseService.user.findUnique({
                    where: { id: uid },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        passwordHash: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                        activeUserType: true,
                    },
                });
                if (localUser) {
                    console.warn(`Local user ${uid} exists but Firebase user is missing`);
                    return {
                        firebaseUser: null,
                        localUser: localUser,
                    };
                }
                throw new common_1.NotFoundException(`User with ID ${uid} not found in Firebase or local database`);
            }
            console.error(`Error fetching user with ID ${uid}:`, error);
            throw new common_1.BadRequestException(`Failed to fetch user: ${error.message}`);
        }
    }
    async update(uid, updateUserDto) {
        try {
            const firebaseUpdateParams = {};
            if (updateUserDto.displayName) {
                firebaseUpdateParams.displayName = updateUserDto.displayName;
            }
            else if (updateUserDto.firstName || updateUserDto.lastName) {
                const nameParts = [];
                if (updateUserDto.firstName)
                    nameParts.push(updateUserDto.firstName);
                if (updateUserDto.lastName)
                    nameParts.push(updateUserDto.lastName);
                if (nameParts.length > 0) {
                    firebaseUpdateParams.displayName = nameParts.join(' ');
                }
            }
            if (updateUserDto.email)
                firebaseUpdateParams.email = updateUserDto.email;
            if (updateUserDto.phoneNumber)
                firebaseUpdateParams.phoneNumber = updateUserDto.phoneNumber;
            if (updateUserDto.password)
                firebaseUpdateParams.password = updateUserDto.password;
            const userRecord = await firebaseAdmin
                .auth()
                .updateUser(uid, firebaseUpdateParams);
            await this.updateLocalUser(uid, updateUserDto);
            return userRecord;
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                throw new common_1.NotFoundException(`User with ID ${uid} not found`);
            }
            console.error(`Error updating user with ID ${uid}:`, error);
            throw new common_1.BadRequestException(`Failed to update user: ${error.message}`);
        }
    }
    async updateLocalUser(uid, updateData) {
        try {
            const existingUser = await this.databaseService.user.findFirst({
                where: {
                    id: uid,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    passwordHash: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    activeUserType: true,
                },
            });
            if (!existingUser) {
                throw new common_1.NotFoundException(`Local user record with Firebase ID ${uid} not found`);
            }
            const updateFields = {};
            if (updateData.email)
                updateFields.email = updateData.email;
            if (updateData.displayName) {
                updateFields.name = updateData.displayName;
            }
            else if (updateData.firstName || updateData.lastName) {
                const existingName = existingUser.name || '';
                const nameParts = existingName.split(' ');
                const firstName = updateData.firstName || (nameParts.length > 0 ? nameParts[0] : '');
                const lastName = updateData.lastName ||
                    (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
                updateFields.name = `${firstName} ${lastName}`.trim();
            }
            if (updateData.phone) {
                updateFields.phone = updateData.phone;
            }
            else if (updateData.phoneNumber) {
                updateFields.phone = updateData.phoneNumber;
            }
            if (updateData.activeUserType) {
                updateFields.activeUserType = updateData.activeUserType;
            }
            const updatedUser = await this.databaseService.$transaction(async (prisma) => {
                return prisma.user.update({
                    where: { id: existingUser.id },
                    data: updateFields,
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        passwordHash: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                        activeUserType: true,
                    },
                });
            });
            return updatedUser;
        }
        catch (error) {
            console.error(`Error updating local user with ID ${uid}:`, error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update local user: ${error.message}`);
        }
    }
    async remove(uid) {
        try {
            await this.databaseService.$transaction(async (prisma) => {
                const localUser = await prisma.user.findFirst({
                    where: {
                        id: uid,
                    },
                    select: {
                        id: true,
                    },
                });
                if (localUser) {
                    await prisma.user.delete({ where: { id: localUser.id } });
                }
                await firebaseAdmin.auth().deleteUser(uid);
            });
            return {
                success: true,
                message: `User with ID ${uid} successfully deleted from both Firebase and local database`,
            };
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    const localUser = await this.databaseService.user.findFirst({
                        where: {
                            id: uid,
                        },
                    });
                    if (localUser) {
                        await this.databaseService.user.delete({
                            where: { id: localUser.id },
                        });
                        return {
                            success: true,
                            message: `Local user with ID ${localUser.id} deleted (Firebase user not found)`,
                        };
                    }
                    throw new common_1.NotFoundException(`User with ID ${uid} not found in Firebase or local database`);
                }
                catch (localError) {
                    console.error(`Error deleting local user with ID ${uid}:`, localError);
                    throw new common_1.BadRequestException(`Failed to delete local user: ${localError.message}`);
                }
            }
            console.error(`Error deleting user with ID ${uid}:`, error);
            throw new common_1.BadRequestException(`Failed to delete user: ${error.message}`);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map
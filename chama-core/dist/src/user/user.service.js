"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const firebaseAdmin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    /**
     * Update user's active user type (ADMIN or MEMBER)
     * @param uid User ID
     * @param userType User type to set
     * @returns Updated user
     */
    updateUserType(uid, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify the user exists
                const { localUser } = yield this.findOne(uid);
                if (!localUser) {
                    throw new common_1.NotFoundException(`User with ID ${uid} not found in local database`);
                }
                // Update the user's activeUserType
                const updatedUser = yield this.databaseService.user.update({
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
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to update user type: ${message}`);
            }
        });
    }
    registerUser(registerUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log(registerUser);
            try {
                // First create the Firebase user
                const userRecord = yield firebaseAdmin.auth().createUser({
                    displayName: `${registerUser.firstName} ${registerUser.lastName}`,
                    email: registerUser.email,
                    password: registerUser.password,
                    phoneNumber: registerUser.phoneNumber,
                });
                console.log('Firebase User Record:', userRecord);
                // Then create the local user with transaction to ensure atomicity
                const localUser = yield this.databaseService.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    // Create local user with all available fields
                    const user = yield prisma.user.create({
                        data: {
                            id: userRecord.uid, // Use Firebase UID as reference
                            email: registerUser.email,
                            name: `${registerUser.firstName} ${registerUser.lastName}`,
                            phone: registerUser.phoneNumber || '',
                            // activeUserType: registerUser.activeUserType ?? UserType.MEMBER,
                        },
                    });
                    return user;
                }));
                console.log('Local User Record:', localUser);
                // After successful registration, automatically generate auth tokens (same as login)
                const { email, password } = registerUser;
                const response = yield this.signInWithEmailAndPassword(email, password);
                // Ensure response contains the expected properties before destructuring
                if (!response || !response.idToken) {
                    throw new Error('Authentication failed after registration: Invalid response from Firebase');
                }
                const { idToken, refreshToken, expiresIn } = response;
                // Return authentication tokens and user details (LoginResponse format)
                return {
                    idToken,
                    refreshToken,
                    expiresIn,
                    user: {
                        localUser: localUser,
                    },
                };
            }
            catch (error) {
                console.error('Error creating user:', error);
                // Type check for error with code property
                const errorWithCode = error;
                // If Firebase user was created but local user creation failed,
                // attempt to delete the Firebase user to maintain consistency
                if (errorWithCode.code !== 'auth/email-already-exists' && errorWithCode.firebaseUid) {
                    try {
                        yield firebaseAdmin.auth().deleteUser(errorWithCode.firebaseUid);
                        console.log(`Rolled back Firebase user creation for UID: ${errorWithCode.firebaseUid}`);
                    }
                    catch (deleteError) {
                        console.error('Error rolling back Firebase user creation:', deleteError);
                    }
                }
                // Provide more specific error messages based on error type
                if (errorWithCode.code === 'auth/email-already-exists') {
                    throw new common_1.BadRequestException('Email address is already in use');
                }
                else if (errorWithCode.code === 'auth/invalid-phone-number') {
                    throw new common_1.BadRequestException('The phone number is invalid');
                }
                else if ((_a = errorWithCode.code) === null || _a === void 0 ? void 0 : _a.includes('prisma')) {
                    const message = error instanceof Error ? error.message : 'Database error';
                    throw new common_1.BadRequestException(`Database error: ${message}`);
                }
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`User registration failed: ${message}`);
            }
        });
    }
    /**
     * Authenticates a user with email and password
     *
     * @param payload - Login credentials containing email and password
     * @returns A LoginResponse object containing authentication tokens and user details
     *
     * Example response:
     * {
     *   "idToken": "firebase-id-token",
     *   "refreshToken": "firebase-refresh-token",
     *   "expiresIn": "3600",
     *   "user": {
     *     "firebaseUser": { uid, email, displayName, ... },
     *     "localUser": { id, email, firstName, lastName, ... }
     *   }
     * }
     */
    loginUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            try {
                const response = yield this.signInWithEmailAndPassword(email, password);
                // Ensure response contains the expected properties before destructuring
                if (!response || !response.idToken) {
                    throw new Error('Authentication failed: Invalid response from Firebase');
                }
                const { idToken, refreshToken, expiresIn } = response;
                // Decode the token to get the user ID
                const decodedToken = yield firebaseAdmin.auth().verifyIdToken(idToken);
                const uid = decodedToken.uid;
                // Get the user details using the findOne method
                const userDetails = yield this.findOne(uid);
                // Since this is a login operation, we should always have a local user
                // If we don't, something went wrong
                if (!userDetails.localUser) {
                    throw new Error('Authentication failed: Local user not found after login');
                }
                // Return enhanced response with both tokens and user details
                return {
                    idToken,
                    refreshToken,
                    expiresIn,
                    user: {
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
        });
    }
    signInWithEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.FIREBASE_API_KEY) {
                throw new Error('Firebase API key is not configured. Please set the FIREBASE_API_KEY environment variable.');
            }
            const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
            return yield this.sendPostRequest(url, {
                email,
                password,
                returnSecureToken: true,
            });
        });
    }
    sendPostRequest(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield axios_1.default.post(url, data, {
                    headers: { 'Content-Type': 'application/json' },
                });
                return response.data;
            }
            catch (error) {
                console.error('API request failed:', error.message);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    throw new Error(((_b = (_a = error.response.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message) || 'API request failed');
                }
                throw error;
            }
        });
    }
    validateRequestAndGetToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const decodedToken = yield firebaseAdmin.auth().verifyIdToken(token);
                console.log('Token verified successfully:', decodedToken);
                return decodedToken;
            }
            catch (error) {
                const errorWithCode = error;
                const message = error instanceof Error ? error.message : 'Unknown error';
                console.error('Token verification failed:', message);
                if (errorWithCode.code === 'auth/id-token-expired') {
                    console.error('Token has expired.');
                }
                else if (errorWithCode.code === 'auth/invalid-id-token') {
                    console.error('Invalid ID token provided.');
                }
                return null;
            }
        });
    }
    refreshAuthToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_token: idToken, refresh_token: newRefreshToken, expires_in: expiresIn, } = yield this.sendRefreshAuthTokenRequest(refreshToken);
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
        });
    }
    sendRefreshAuthTokenRequest(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`;
            const payload = {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            };
            return yield this.sendPostRequest(url, payload);
        });
    }
    findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Default to 1000 users per page if not specified
                const maxResults = (params === null || params === void 0 ? void 0 : params.maxResults) || 1000;
                // Fetch users from Firebase with correct parameter order
                const listUsersResult = yield firebaseAdmin
                    .auth()
                    .listUsers(maxResults, params === null || params === void 0 ? void 0 : params.pageToken);
                return {
                    users: listUsersResult.users,
                    pageToken: listUsersResult.pageToken,
                };
            }
            catch (error) {
                console.error('Error listing users:', error);
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to fetch users: ${message}`);
            }
        });
    }
    /**
     * Find a user by their Firebase UID and return both Firebase and local user data
     * @param uid The Firebase UID of the user
     * @returns Combined user data in a format matching UserResponseEntity
     */
    findOne(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the Firebase user
                const firebaseUser = yield firebaseAdmin.auth().getUser(uid);
                // Get the local user data with all fields needed for UserEntity
                const localUser = yield this.databaseService.user.findFirst({
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
                // If local user doesn't exist but Firebase user does,
                // create a basic local user record for consistency
                if (!localUser && firebaseUser) {
                    const newLocalUser = yield this.databaseService.user.create({
                        data: {
                            id: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            name: firebaseUser.displayName || '',
                            phone: firebaseUser.phoneNumber || '',
                            activeUserType: 'MEMBER', // Default to MEMBER user type
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
                        localUser: newLocalUser,
                    };
                }
                return {
                    localUser: localUser,
                };
            }
            catch (error) {
                const errorWithCode = error;
                if (errorWithCode.code === 'auth/user-not-found') {
                    // If Firebase user not found, check if local user exists
                    const localUser = yield this.databaseService.user.findUnique({
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
                        // Local user exists but Firebase user doesn't - unusual situation
                        console.warn(`Local user ${uid} exists but Firebase user is missing`);
                        return {
                            localUser: localUser,
                        };
                    }
                    throw new common_1.NotFoundException(`User with ID ${uid} not found in Firebase or local database`);
                }
                console.error(`Error fetching user with ID ${uid}:`, error);
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to fetch user: ${message}`);
            }
        });
    }
    /**
     * Update a user's information in both Firebase and local database
     * @param uid The Firebase UID of the user to update
     * @param updateUserDto The data to update
     * @returns Updated Firebase user record
     */
    update(uid, updateUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First update Firebase user
                // Create a Firebase-compatible update object
                const firebaseUpdateParams = {};
                // Only include fields that are defined
                if (updateUserDto.displayName) {
                    firebaseUpdateParams.displayName = updateUserDto.displayName;
                }
                else if (updateUserDto.firstName || updateUserDto.lastName) {
                    // Combine firstName and lastName if provided
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
                const userRecord = yield firebaseAdmin
                    .auth()
                    .updateUser(uid, firebaseUpdateParams);
                // Then update local user data
                yield this.updateLocalUser(uid, updateUserDto);
                return userRecord;
            }
            catch (error) {
                const errorWithCode = error;
                if (errorWithCode.code === 'auth/user-not-found') {
                    throw new common_1.NotFoundException(`User with ID ${uid} not found`);
                }
                console.error(`Error updating user with ID ${uid}:`, error);
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to update user: ${message}`);
            }
        });
    }
    /**
     * Updates the local user record in the database
     * @param uid Firebase user ID
     * @param updateData Data to update
     */
    /**
     * Updates the local user record in the database
     * @param uid Firebase user ID
     * @param updateData Data to update
     * @returns Updated local user record
     */
    updateLocalUser(uid, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First check if user exists in local database
                const existingUser = yield this.databaseService.user.findFirst({
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
                // Prepare update data - only include fields that are provided
                const updateFields = {};
                if (updateData.email)
                    updateFields.email = updateData.email;
                // Handle name field - can come from displayName or firstName+lastName
                if (updateData.displayName) {
                    updateFields.name = updateData.displayName;
                }
                else if (updateData.firstName || updateData.lastName) {
                    // If we have current user info, use it to update only parts of the name
                    const existingName = existingUser.name || '';
                    const nameParts = existingName.split(' ');
                    const firstName = updateData.firstName || (nameParts.length > 0 ? nameParts[0] : '');
                    const lastName = updateData.lastName ||
                        (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
                    updateFields.name = `${firstName} ${lastName}`.trim();
                }
                // Handle phone number from either phone or phoneNumber field
                if (updateData.phone) {
                    updateFields.phone = updateData.phone;
                }
                else if (updateData.phoneNumber) {
                    updateFields.phone = updateData.phoneNumber;
                }
                // Add activeUserType if provided
                if (updateData.activeUserType) {
                    updateFields.activeUserType = updateData.activeUserType;
                }
                // Add any other fields that should be updatable
                // Update the user in a transaction
                const updatedUser = yield this.databaseService.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
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
                }));
                return updatedUser;
            }
            catch (error) {
                console.error(`Error updating local user with ID ${uid}:`, error);
                if (error instanceof common_1.NotFoundException) {
                    throw error;
                }
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to update local user: ${message}`);
            }
        });
    }
    /**
     * Remove a user from both Firebase and the local database
     * @param uid The Firebase UID of the user to remove
     * @returns Success message
     */
    remove(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use a transaction to delete both Firebase and local user
                yield this.databaseService.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    // First try to find and delete the local user
                    const localUser = yield prisma.user.findFirst({
                        where: {
                            id: uid,
                        },
                        select: {
                            id: true,
                        },
                    });
                    if (localUser) {
                        yield prisma.user.delete({ where: { id: localUser.id } });
                    }
                    // Then delete the Firebase user
                    yield firebaseAdmin.auth().deleteUser(uid);
                }));
                return {
                    success: true,
                    message: `User with ID ${uid} successfully deleted from both Firebase and local database`,
                };
            }
            catch (error) {
                const errorWithCode = error;
                if (errorWithCode.code === 'auth/user-not-found') {
                    // If Firebase user doesn't exist but local user might, try to delete just local user
                    try {
                        const localUser = yield this.databaseService.user.findFirst({
                            where: {
                                id: uid,
                            },
                        });
                        if (localUser) {
                            yield this.databaseService.user.delete({
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
                        const message = localError instanceof Error ? localError.message : 'Unknown error';
                        throw new common_1.BadRequestException(`Failed to delete local user: ${message}`);
                    }
                }
                console.error(`Error deleting user with ID ${uid}:`, error);
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to delete user: ${message}`);
            }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);

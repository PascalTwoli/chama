"use strict";
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
exports.UserType = void 0;
exports.updateUser = updateUser;
// Define UserType enum to match the backend
var UserType;
(function (UserType) {
    UserType["MEMBER"] = "MEMBER";
    UserType["ADMIN"] = "ADMIN";
})(UserType || (exports.UserType = UserType = {}));
/**
 * Example function to update a user using axios
 */
const axios_1 = __importDefault(require("axios"));
/**
 * Updates a user in the system
 * @param userId - The ID of the user to update
 * @param updateData - The data to update
 * @param token - The authentication token
 * @returns The updated user data
 */
function updateUser(userId, updateData, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate that at least one field is provided
            if (Object.keys(updateData).length === 0) {
                throw new Error('At least one field must be provided for update');
            }
            // Make the API request
            const response = yield axios_1.default.patch(`/user/${userId}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            // Handle different types of errors
            if (axios_1.default.isAxiosError(error)) {
                const axiosError = error;
                if (axiosError.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    const statusCode = axiosError.response.status;
                    const errorData = axiosError.response.data;
                    switch (statusCode) {
                        case 400:
                            throw new Error(`Bad request: ${errorData.message || 'Invalid update data'}`);
                        case 401:
                            throw new Error('Unauthorized: You must be logged in to update a user');
                        case 403:
                            throw new Error('Forbidden: You are not authorized to update this user');
                        case 404:
                            throw new Error(`User with ID ${userId} not found`);
                        default:
                            throw new Error(`Server error: ${errorData.message || 'Failed to update user'}`);
                    }
                }
                else if (axiosError.request) {
                    // The request was made but no response was received
                    throw new Error('No response received from server. Please check your connection.');
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    throw new Error(`Request error: ${axiosError.message}`);
                }
            }
            // For non-axios errors
            throw error;
        }
    });
}
/**
 * Usage examples
 */
// Example 1: Update user's name
function updateUserName() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
        const token = 'your_firebase_id_token';
        try {
            const updatedUser = yield updateUser(userId, {
                firstName: 'Jane',
                lastName: 'Smith'
            }, token);
            console.log('User updated successfully:', updatedUser);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Failed to update user:', message);
        }
    });
}
// Example 2: Update user's email and phone
function updateUserContactInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
        const token = 'your_firebase_id_token';
        try {
            const updatedUser = yield updateUser(userId, {
                email: 'jane.smith@example.com',
                phoneNumber: '+1234567890'
            }, token);
            console.log('User contact info updated successfully:', updatedUser);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Failed to update user contact info:', message);
        }
    });
}
// Example 3: Update user's password
function updateUserPassword() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
        const token = 'your_firebase_id_token';
        try {
            const updatedUser = yield updateUser(userId, {
                password: 'NewStrongP@ssw0rd!'
            }, token);
            console.log('User password updated successfully');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Failed to update user password:', message);
        }
    });
}
// Example 4: Update user's role
function updateUserRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
        const token = 'your_firebase_id_token';
        try {
            const updatedUser = yield updateUser(userId, {
                activeUserType: UserType.ADMIN
            }, token);
            console.log('User role updated successfully:', updatedUser);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Failed to update user role:', message);
        }
    });
}

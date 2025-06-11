"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
exports.updateUser = updateUser;
var UserType;
(function (UserType) {
    UserType["MEMBER"] = "MEMBER";
    UserType["ADMIN"] = "ADMIN";
})(UserType || (exports.UserType = UserType = {}));
const axios_1 = require("axios");
async function updateUser(userId, updateData, token) {
    try {
        if (Object.keys(updateData).length === 0) {
            throw new Error('At least one field must be provided for update');
        }
        const response = await axios_1.default.patch(`/user/${userId}`, updateData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            if (axiosError.response) {
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
                throw new Error('No response received from server. Please check your connection.');
            }
            else {
                throw new Error(`Request error: ${axiosError.message}`);
            }
        }
        throw error;
    }
}
async function updateUserName() {
    const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
    const token = 'your_firebase_id_token';
    try {
        const updatedUser = await updateUser(userId, {
            firstName: 'Jane',
            lastName: 'Smith'
        }, token);
        console.log('User updated successfully:', updatedUser);
    }
    catch (error) {
        console.error('Failed to update user:', error.message);
    }
}
async function updateUserContactInfo() {
    const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
    const token = 'your_firebase_id_token';
    try {
        const updatedUser = await updateUser(userId, {
            email: 'jane.smith@example.com',
            phoneNumber: '+1234567890'
        }, token);
        console.log('User contact info updated successfully:', updatedUser);
    }
    catch (error) {
        console.error('Failed to update user contact info:', error.message);
    }
}
async function updateUserPassword() {
    const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
    const token = 'your_firebase_id_token';
    try {
        const updatedUser = await updateUser(userId, {
            password: 'NewStrongP@ssw0rd!'
        }, token);
        console.log('User password updated successfully');
    }
    catch (error) {
        console.error('Failed to update user password:', error.message);
    }
}
async function updateUserRole() {
    const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
    const token = 'your_firebase_id_token';
    try {
        const updatedUser = await updateUser(userId, {
            activeUserType: UserType.ADMIN
        }, token);
        console.log('User role updated successfully:', updatedUser);
    }
    catch (error) {
        console.error('Failed to update user role:', error.message);
    }
}
//# sourceMappingURL=update-user-example.js.map
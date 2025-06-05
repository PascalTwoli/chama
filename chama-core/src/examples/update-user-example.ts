// Define UserType enum to match the backend
export enum UserType {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}

/**
 * Interface for user update request body
 * Mirrors the UpdateUserDto on the server
 */
export interface UpdateUserDto {
  // User's first name (optional)
  firstName?: string;
  
  // User's last name (optional)
  lastName?: string;
  
  // User's display name (alternative to firstName + lastName)
  displayName?: string;
  
  // User's email address (optional)
  email?: string;
  
  // User's phone number (optional)
  phoneNumber?: string;
  
  // Alternative field for phone (for backward compatibility)
  phone?: string;
  
  // User's new password (optional)
  // Must be at least 8 characters and contain at least one uppercase letter, 
  // one lowercase letter, one number, and one special character
  password?: string;
  
  // User's active type (role)
  activeUserType?: UserType;
}

/**
 * Response interface for user update
 */
export interface FirebaseUserResponse {
  uid: string;
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
}

/**
 * Example function to update a user using axios
 */
import axios, { AxiosError } from 'axios';

/**
 * Updates a user in the system
 * @param userId - The ID of the user to update
 * @param updateData - The data to update
 * @param token - The authentication token
 * @returns The updated user data
 */
export async function updateUser(
  userId: string, 
  updateData: UpdateUserDto, 
  token: string
): Promise<FirebaseUserResponse> {
  try {
    // Validate that at least one field is provided
    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field must be provided for update');
    }

    // Make the API request
    const response = await axios.patch<FirebaseUserResponse>(
      `/user/${userId}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const statusCode = axiosError.response.status;
        const errorData = axiosError.response.data as any;
        
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
      } else if (axiosError.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Request error: ${axiosError.message}`);
      }
    }
    
    // For non-axios errors
    throw error;
  }
}

/**
 * Usage examples
 */

// Example 1: Update user's name
async function updateUserName() {
  const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
  const token = 'your_firebase_id_token';
  
  try {
    const updatedUser = await updateUser(userId, {
      firstName: 'Jane',
      lastName: 'Smith'
    }, token);
    
    console.log('User updated successfully:', updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error.message);
  }
}

// Example 2: Update user's email and phone
async function updateUserContactInfo() {
  const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
  const token = 'your_firebase_id_token';
  
  try {
    const updatedUser = await updateUser(userId, {
      email: 'jane.smith@example.com',
      phoneNumber: '+1234567890'
    }, token);
    
    console.log('User contact info updated successfully:', updatedUser);
  } catch (error) {
    console.error('Failed to update user contact info:', error.message);
  }
}

// Example 3: Update user's password
async function updateUserPassword() {
  const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
  const token = 'your_firebase_id_token';
  
  try {
    const updatedUser = await updateUser(userId, {
      password: 'NewStrongP@ssw0rd!'
    }, token);
    
    console.log('User password updated successfully');
  } catch (error) {
    console.error('Failed to update user password:', error.message);
  }
}

// Example 4: Update user's role
async function updateUserRole() {
  const userId = 'VzOoXfSaA3g7GdZLbV6Yb2xZm1k1';
  const token = 'your_firebase_id_token';
  
  try {
    const updatedUser = await updateUser(userId, {
      activeUserType: UserType.ADMIN
    }, token);
    
    console.log('User role updated successfully:', updatedUser);
  } catch (error) {
    console.error('Failed to update user role:', error.message);
  }
}


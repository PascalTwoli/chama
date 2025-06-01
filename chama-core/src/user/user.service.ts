import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'generated/prisma';

// Interface for pagination parameters
export interface PaginationParams {
  maxResults?: number;
  pageToken?: string;
}

// Interface for paginated user list response
export interface UserListResponse {
  users: firebaseAdmin.auth.UserRecord[];
  pageToken?: string;
}

// Interface for enhanced login response
export interface LoginResponse {
  // Authentication tokens
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  // User details
  user: {
    firebaseUser: firebaseAdmin.auth.UserRecord | null;
    localUser: any;
  };
}

@Injectable()
export class UserService {
  constructor(private databaseService: PrismaService) {}

  /**
   * Update user's active user type (ADMIN or MEMBER)
   * @param uid User ID
   * @param userType User type to set
   * @returns Updated user
   */
  async updateUserType(uid: string, userType: string) {
    try {
      // Verify the user exists
      const { firebaseUser, localUser } = await this.findOne(uid);
      
      if (!localUser) {
        throw new NotFoundException(`User with ID ${uid} not found in local database`);
      }
      
      // Update the user's activeUserType
      const updatedUser = await this.databaseService.user.update({
        where: { id: uid },
        data: { activeUserType: userType as any } // Cast to any since enum validation is handled via DTO
      });
      
      return {
        success: true,
        message: `User type updated to ${userType}`,
        user: updatedUser
      };
    } catch (error) {
      console.error(`Error updating user type for ${uid}:`, error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException(`Failed to update user type: ${error.message}`);
    }
  }

  async registerUser(registerUser: RegisterUserDto): Promise<LoginResponse> {
    console.log(registerUser);
    try {
      // First create the Firebase user
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: `${registerUser.firstName} ${registerUser.lastName}`,
        email: registerUser.email,
        password: registerUser.password,
        phoneNumber: registerUser.phoneNumber,
      });
      console.log('Firebase User Record:', userRecord);

      // Then create the local user with transaction to ensure atomicity
      const localUser = await this.databaseService.$transaction(
        async (prisma) => {
          // Create local user with all available fields
          const user = await prisma.user.create({
            data: {
              id: userRecord.uid, // Use Firebase UID as reference
              email: registerUser.email,
              name: `${registerUser.firstName} ${registerUser.lastName}`,
              phone: registerUser.phoneNumber || '',
              activeUserType: registerUser.activeUserType ?? UserType.MEMBER,
            },
          });

          return user;
        },
      );

      console.log('Local User Record:', localUser);

      // After successful registration, automatically generate auth tokens (same as login)
      const { email, password } = registerUser;
      const response = await this.signInWithEmailAndPassword(email, password);

      // Ensure response contains the expected properties before destructuring
      if (!response || !response.idToken) {
        throw new Error(
          'Authentication failed after registration: Invalid response from Firebase',
        );
      }

      const { idToken, refreshToken, expiresIn } = response;

      // Return authentication tokens and user details (LoginResponse format)
      return {
        idToken,
        refreshToken,
        expiresIn,
        user: {
          firebaseUser: userRecord,
          localUser: localUser,
        },
      };
    } catch (error) {
      console.error('Error creating user:', error);

      // If Firebase user was created but local user creation failed,
      // attempt to delete the Firebase user to maintain consistency
      if (error.code !== 'auth/email-already-exists' && error.firebaseUid) {
        try {
          await firebaseAdmin.auth().deleteUser(error.firebaseUid);
          console.log(
            `Rolled back Firebase user creation for UID: ${error.firebaseUid}`,
          );
        } catch (deleteError) {
          console.error(
            'Error rolling back Firebase user creation:',
            deleteError,
          );
        }
      }

      // Provide more specific error messages based on error type
      if (error.code === 'auth/email-already-exists') {
        throw new BadRequestException('Email address is already in use');
      } else if (error.code === 'auth/invalid-phone-number') {
        throw new BadRequestException('The phone number is invalid');
      } else if (error.code?.includes('prisma')) {
        throw new BadRequestException(`Database error: ${error.message}`);
      }

      throw new BadRequestException(
        `User registration failed: ${error.message}`,
      );
    }
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
  async loginUser(payload: LoginDto): Promise<LoginResponse> {
    const { email, password } = payload;
    try {
      const response = await this.signInWithEmailAndPassword(email, password);

      // Ensure response contains the expected properties before destructuring
      if (!response || !response.idToken) {
        throw new Error(
          'Authentication failed: Invalid response from Firebase',
        );
      }

      const { idToken, refreshToken, expiresIn } = response;

      // Decode the token to get the user ID
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Get the user details using the findOne method
      const userDetails = await this.findOne(uid);

      // Since this is a login operation, we should always have a Firebase user
      // If we don't, something went wrong
      if (!userDetails.firebaseUser) {
        throw new Error(
          'Authentication failed: Firebase user not found after login',
        );
      }

      // Return enhanced response with both tokens and user details
      return {
        idToken,
        refreshToken,
        expiresIn,
        user: {
          // Create a new object to help TypeScript recognize the non-null value
          firebaseUser: userDetails.firebaseUser!, // Use non-null assertion since we've checked above
          localUser: userDetails.localUser,
        },
      };
    } catch (error: any) {
      if (error.message.includes('EMAIL_NOT_FOUND')) {
        throw new Error('User not found.');
      } else if (error.message.includes('INVALID_PASSWORD')) {
        throw new Error('Invalid password.');
      } else {
        throw new Error(`Authentication failed: ${error.message}`);
      }
    }
  }
  private async signInWithEmailAndPassword(email: string, password: string) {
    if (!process.env.FIREBASE_API_KEY) {
      throw new Error(
        'Firebase API key is not configured. Please set the FIREBASE_API_KEY environment variable.',
      );
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }

  private async sendPostRequest(url: string, data: any) {
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      console.error('API request failed:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        throw new Error(
          error.response.data?.error?.message || 'API request failed',
        );
      }
      throw error;
    }
  }

  async validateRequest(req): Promise<boolean> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('Authorization header not provided.');
      return false;
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      console.log('Invalid authorization format. Expected "Bearer <token>".');
      return false;
    }
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      console.log('Decoded Token:', decodedToken);
      return true;
    } catch (error) {
      if (error.code === 'auth/id-token-expired') {
        console.error('Token has expired.');
      } else if (error.code === 'auth/invalid-id-token') {
        console.error('Invalid ID token provided.');
      } else {
        console.error('Error verifying token:', error);
      }
      return false;
    }
  }

  async refreshAuthToken(refreshToken: string) {
    try {
      const {
        id_token: idToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = await this.sendRefreshAuthTokenRequest(refreshToken);
      return {
        idToken,
        refreshToken: newRefreshToken,
        expiresIn,
      };
    } catch (error: any) {
      if (error.message.includes('INVALID_REFRESH_TOKEN')) {
        throw new Error(`Invalid refresh token: ${refreshToken}.`);
      } else {
        throw new Error('Failed to refresh token');
      }
    }
  }
  private async sendRefreshAuthTokenRequest(refreshToken: string) {
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`;
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    return await this.sendPostRequest(url, payload);
  }

  async findAll(params?: PaginationParams): Promise<UserListResponse> {
    try {
      // Default to 1000 users per page if not specified
      const maxResults = params?.maxResults || 1000;

      // Fetch users from Firebase with correct parameter order
      const listUsersResult = await firebaseAdmin
        .auth()
        .listUsers(maxResults, params?.pageToken);

      return {
        users: listUsersResult.users,
        pageToken: listUsersResult.pageToken,
      };
    } catch (error) {
      console.error('Error listing users:', error);
      throw new BadRequestException(`Failed to fetch users: ${error.message}`);
    }
  }

  async findOne(
    uid: string,
  ): Promise<{
    firebaseUser: firebaseAdmin.auth.UserRecord | null;
    localUser: any;
  }> {
    try {
      // Get the Firebase user
      const firebaseUser = await firebaseAdmin.auth().getUser(uid);

      // Get the local user data
      const localUser = await this.databaseService.user.findFirst({
        where: {
          OR: [
            { id: uid },
            ...(firebaseUser.email ? [{ email: firebaseUser.email }] : []),
          ],
        },
      });

      // If local user doesn't exist but Firebase user does,
      // create a basic local user record for consistency
      if (!localUser && firebaseUser) {
        const newLocalUser = await this.databaseService.user.create({
          data: {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            phone: firebaseUser.phoneNumber || '',
            activeUserType: 'MEMBER', // Default to MEMBER user type
          },
        });

        return { firebaseUser, localUser: newLocalUser };
      }

      return { firebaseUser, localUser };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // If Firebase user not found, check if local user exists
        const localUser = await this.databaseService.user.findUnique({
          where: { id: uid },
        });

        if (localUser) {
          // Local user exists but Firebase user doesn't - unusual situation
          console.warn(`Local user ${uid} exists but Firebase user is missing`);
          return {
            firebaseUser: null,
            localUser,
          };
        }

        throw new NotFoundException(
          `User with ID ${uid} not found in Firebase or local database`,
        );
      }

      console.error(`Error fetching user with ID ${uid}:`, error);
      throw new BadRequestException(`Failed to fetch user: ${error.message}`);
    }
  }

  async update(uid: string, updateUserDto: UpdateUserDto) {
    try {
      // First update Firebase user
      // Create a Firebase-compatible update object
      const firebaseUpdateParams: any = {};

      // Only include fields that are defined
      if (updateUserDto.displayName) {
        firebaseUpdateParams.displayName = updateUserDto.displayName;
      } else if (updateUserDto.firstName || updateUserDto.lastName) {
        // Combine firstName and lastName if provided
        const nameParts: string[] = [];
        if (updateUserDto.firstName) nameParts.push(updateUserDto.firstName);
        if (updateUserDto.lastName) nameParts.push(updateUserDto.lastName);
        if (nameParts.length > 0) {
          firebaseUpdateParams.displayName = nameParts.join(' ');
        }
      }

      if (updateUserDto.email) firebaseUpdateParams.email = updateUserDto.email;
      if (updateUserDto.phoneNumber)
        firebaseUpdateParams.phoneNumber = updateUserDto.phoneNumber;
      if (updateUserDto.password)
        firebaseUpdateParams.password = updateUserDto.password;

      const userRecord = await firebaseAdmin
        .auth()
        .updateUser(uid, firebaseUpdateParams);

      // Then update local user data
      await this.updateLocalUser(uid, updateUserDto);

      return userRecord;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundException(`User with ID ${uid} not found`);
      }
      console.error(`Error updating user with ID ${uid}:`, error);
      throw new BadRequestException(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Updates the local user record in the database
   * @param uid Firebase user ID
   * @param updateData Data to update
   */
  async updateLocalUser(uid: string, updateData: Partial<UpdateUserDto>) {
    try {
      // First check if user exists in local database
      const existingUser = await this.databaseService.user.findFirst({
        where: {
          id: uid,
        },
      });

      if (!existingUser) {
        throw new NotFoundException(
          `Local user record with Firebase ID ${uid} not found`,
        );
      }

      // Prepare update data - only include fields that are provided
      const updateFields: any = {};

      if (updateData.email) updateFields.email = updateData.email;

      // Handle name field - can come from displayName or firstName+lastName
      if (updateData.displayName) {
        updateFields.name = updateData.displayName;
      } else if (updateData.firstName || updateData.lastName) {
        // If we have current user info, use it to update only parts of the name
        const existingName = existingUser.name || '';
        const nameParts = existingName.split(' ');
        const firstName =
          updateData.firstName || (nameParts.length > 0 ? nameParts[0] : '');
        const lastName =
          updateData.lastName ||
          (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
        updateFields.name = `${firstName} ${lastName}`.trim();
      }

      // Handle phone number from either phone or phoneNumber field
      if (updateData.phone) {
        updateFields.phone = updateData.phone;
      } else if (updateData.phoneNumber) {
        updateFields.phone = updateData.phoneNumber;
      }

      // Add activeUserType if provided
      if (updateData.activeUserType) {
        updateFields.activeUserType = updateData.activeUserType;
      }

      // Add any other fields that should be updatable

      // Update the user in a transaction
      const updatedUser = await this.databaseService.$transaction(
        async (prisma) => {
          return prisma.user.update({
            where: { id: existingUser.id },
            data: updateFields,
          });
        },
      );

      return updatedUser;
    } catch (error) {
      console.error(`Error updating local user with ID ${uid}:`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to update local user: ${error.message}`,
      );
    }
  }

  async remove(uid: string) {
    try {
      // Use a transaction to delete both Firebase and local user
      await this.databaseService.$transaction(async (prisma) => {
        // First try to find and delete the local user
        const localUser = await prisma.user.findFirst({
          where: {
            id: uid,
          },
        });

        if (localUser) {
          await prisma.user.delete({ where: { id: localUser.id } });
        }

        // Then delete the Firebase user
        await firebaseAdmin.auth().deleteUser(uid);
      });

      return {
        success: true,
        message: `User with ID ${uid} successfully deleted from both Firebase and local database`,
      };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // If Firebase user doesn't exist but local user might, try to delete just local user
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

          throw new NotFoundException(
            `User with ID ${uid} not found in Firebase or local database`,
          );
        } catch (localError) {
          console.error(
            `Error deleting local user with ID ${uid}:`,
            localError,
          );
          throw new BadRequestException(
            `Failed to delete local user: ${localError.message}`,
          );
        }
      }

      console.error(`Error deleting user with ID ${uid}:`, error);
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
  }
}

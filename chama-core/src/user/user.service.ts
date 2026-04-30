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
import { PrismaService } from '../prisma/prisma.service';
import { UserType, Prisma } from '@prisma/client';
import {
  UserEntity,
  FirebaseUserEntity,
  UserResponseEntity,
} from './entities/user.entity';

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

// Enhanced interface for user response matching our entity - Firebase data removed
export interface EnhancedUserResponse {
  localUser: UserEntity;
}

// Interface for enhanced login response - Firebase data removed
export interface LoginResponse {
  // Authentication tokens
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  // User details
  user: {
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
  async updateUserType(uid: string, userType: UserType) {
    try {
      // Verify the user exists
      const { localUser } = await this.findOne(uid);

      if (!localUser) {
        throw new NotFoundException(
          `User with ID ${uid} not found in local database`,
        );
      }

      // Update the user's activeUserType
      const updatedUser = await this.databaseService.user.update({
        where: { id: uid },
        data: { active_user_type: userType },
      });

      return {
        success: true,
        message: `User type updated to ${userType}`,
        user: updatedUser,
      };
    } catch (error: unknown) {
      console.error(`Error updating user type for ${uid}:`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to update user type: ${message}`);
    }
  }

  async registerUser(registerUser: RegisterUserDto): Promise<LoginResponse> {
    let firebaseUid: string | null = null;
    try {
      // First create the Firebase user
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: `${registerUser.firstName} ${registerUser.lastName}`,
        email: registerUser.email,
        password: registerUser.password,
        phoneNumber: registerUser.phoneNumber,
      });
      firebaseUid = userRecord.uid;

      // Then create the local user with transaction to ensure atomicity
      const localUser = await this.databaseService.$transaction(
        async (prisma: any) => {
          const user = await prisma.user.create({
            data: {
              id: userRecord.uid,
              email: registerUser.email,
              name: `${registerUser.firstName} ${registerUser.lastName}`,
              phone: registerUser.phoneNumber || null,
              updatedAt: new Date(),
            },
          });
          return user;
        },
      );

      // After successful registration, generate auth tokens
      const { email, password } = registerUser;
      const response = await this.signInWithEmailAndPassword(email, password);

      if (!response || !response.idToken) {
        throw new Error(
          'Authentication failed after registration: Invalid response from Firebase',
        );
      }

      const { idToken, refreshToken, expiresIn } = response;

      return {
        idToken,
        refreshToken,
        expiresIn,
        user: { localUser },
      };
    } catch (error: unknown) {
      console.error('Error creating user:', error);

      const errorWithCode = error as any;

      // Roll back Firebase user if it was created but DB creation failed
      if (firebaseUid && !errorWithCode.code?.startsWith('auth/')) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUid);
        } catch (deleteError) {
          console.error('Error rolling back Firebase user:', deleteError);
        }
      }

      // Firebase auth errors
      if (errorWithCode.code === 'auth/email-already-exists') {
        throw new BadRequestException('Email address is already registered');
      }
      if (errorWithCode.code === 'auth/phone-number-already-exists') {
        throw new BadRequestException('Phone number is already registered');
      }
      if (errorWithCode.code === 'auth/invalid-phone-number') {
        throw new BadRequestException('The phone number format is invalid');
      }

      // Prisma unique constraint errors
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const fields = (error.meta?.target as string[]) ?? [];
        if (fields.includes('phone')) {
          throw new BadRequestException('Phone number is already registered');
        }
        if (fields.includes('email')) {
          throw new BadRequestException('Email address is already registered');
        }
        throw new BadRequestException('An account with these details already exists');
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`User registration failed: ${message}`);
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

      // Since this is a login operation, we should always have a local user
      // If we don't, something went wrong
      if (!userDetails.localUser) {
        throw new Error(
          'Authentication failed: Local user not found after login',
        );
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
    } catch (error: any) {
      // Handle specific Firebase error messages
      const errorMessage = error.message || '';

      // Log full error for debugging
      console.error(`[AUTH LOGIN ERROR] Email: ${email}`);
      console.error(`[AUTH LOGIN ERROR] Message: ${errorMessage}`);

      // Firebase REST API returns various error codes for authentication failures
      // USER_NOT_FOUND, EMAIL_NOT_FOUND, INVALID_PASSWORD, INVALID_LOGIN_CREDENTIALS
      if (
        errorMessage.includes('USER_NOT_FOUND') ||
        errorMessage.includes('EMAIL_NOT_FOUND')
      ) {
        throw new Error('User not found.');
      }
      // Handle both INVALID_PASSWORD and INVALID_LOGIN_CREDENTIALS
      // (Firebase may return either code depending on the scenario)
      else if (
        errorMessage.includes('INVALID_PASSWORD') ||
        errorMessage.includes('INVALID_LOGIN_CREDENTIALS')
      ) {
        // Password auth failed - check if this user has linked providers (e.g., Google)
        console.log(
          `[AUTH] Invalid credentials detected. Checking for linked providers for ${email}...`,
        );
        const linkedProvidersInfo = await this.checkLinkedProviders(email);

        console.log(
          `[AUTH] Linked providers check result:`,
          linkedProvidersInfo,
        );

        if (linkedProvidersInfo.hasLinkedProviders) {
          const providers = linkedProvidersInfo.providers.join(', ');
          const message = `Your account is linked to: ${providers}. Please sign in using one of those methods instead.`;
          console.log(`[AUTH] Returning linked provider message: ${message}`);
          throw new Error(message);
        }
        throw new Error('Invalid password.');
      } else if (
        errorMessage.includes('USER_DISABLED') ||
        errorMessage.includes('disabled')
      ) {
        throw new Error(
          'This account has been disabled. Please contact support.',
        );
      } else if (
        errorMessage.includes('account-exists-with-different-credential')
      ) {
        throw new Error(
          'An account with this email already exists with different sign-in credentials. Please sign in using the provider you originally used.',
        );
      } else {
        // For any other error, try to check providers as a fallback
        console.log(`[AUTH] Unknown login error: ${errorMessage}`);
        const linkedProvidersInfo = await this.checkLinkedProviders(email);
        if (linkedProvidersInfo.hasLinkedProviders) {
          const providers = linkedProvidersInfo.providers.join(', ');
          const message = `Your account is linked to: ${providers}. Please sign in using one of those methods instead.`;
          console.log(`[AUTH] Returning linked provider message: ${message}`);
          throw new Error(message);
        }

        // Don't double-wrap the error message
        throw error;
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

  /**
   * Check what authentication providers are linked to an account
   * This helps diagnose why password auth might be failing
   * @param email The email address to check
   * @returns Object with hasLinkedProviders flag and list of providers
   */
  private async checkLinkedProviders(
    email: string,
  ): Promise<{ hasLinkedProviders: boolean; providers: string[] }> {
    try {
      // Use Firebase Admin SDK to get the user record and check linked providers
      console.log(
        `[PROVIDER_CHECK] Fetching user from Firebase for email: ${email}`,
      );

      const userRecord = await firebaseAdmin.auth().getUserByEmail(email);

      console.log(`[PROVIDER_CHECK] User found in Firebase`);
      console.log(
        `[PROVIDER_CHECK] Provider data:`,
        JSON.stringify(userRecord.providerData, null, 2),
      );

      // Extract provider IDs from providerData
      // providerData is an array like: [
      //   { uid: '...', displayName: '...', email: '...', providerId: 'password' },
      //   { uid: '...', displayName: '...', email: '...', providerId: 'google.com' }
      // ]
      const providers = userRecord.providerData.map(p => p.providerId);

      const hasPassword = providers.includes('password');
      const hasGoogle = providers.includes('google.com');
      const hasOther = providers.some(
        (p: string) => p !== 'password' && p !== 'email',
      );

      console.log(`[PROVIDER_CHECK] Parsed values:`);
      console.log(`  - providers array: [${providers.join(', ')}]`);
      console.log(`  - hasPassword: ${hasPassword}`);
      console.log(`  - hasGoogle: ${hasGoogle}`);
      console.log(`  - hasOther: ${hasOther}`);

      // Linked providers exist if we have OAuth providers AND no password provider
      // This means password was disabled by Firebase when OAuth was linked
      const linkedProvidersExists = (hasGoogle || hasOther) && !hasPassword;
      console.log(
        `[PROVIDER_CHECK] Logic: (${hasGoogle} || ${hasOther}) && !${hasPassword} = ${linkedProvidersExists}`,
      );

      return {
        hasLinkedProviders: linkedProvidersExists,
        providers: providers.filter(
          (p: string) => p !== 'password' && p !== 'email',
        ),
      };
    } catch (error: any) {
      console.error(
        '[PROVIDER_CHECK] Error checking linked providers:',
        error.message,
      );
      // User doesn't exist in Firebase - password invalid
      return { hasLinkedProviders: false, providers: [] };
    }
  }

  /**
   * Public method to check authentication providers for an email
   * Used by the API endpoint to diagnose authentication issues
   */
  async checkAuthProvidersForEmail(email: string): Promise<{
    email: string;
    hasPassword: boolean;
    hasGoogle: boolean;
    hasOtherProviders: boolean;
    availableProviders: string[];
    message: string;
  }> {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${process.env.FIREBASE_API_KEY}`;
      const response = await this.sendPostRequest(url, {
        identifier: email,
        continueUri: 'http://localhost',
      });

      const providers = response.signinMethods || [];
      const hasPassword = providers.includes('password');
      const hasGoogle = providers.includes('google.com');
      const otherProviders = providers.filter(
        (p: string) => p !== 'password' && p !== 'email',
      );
      const hasOtherProviders = otherProviders.length > 0;

      // Generate helpful message
      let message = '';
      if (!hasPassword && hasGoogle) {
        message =
          'This account is linked to Google. Use Google sign-in instead of password.';
      } else if (!hasPassword && hasOtherProviders) {
        message = `This account is linked to: ${otherProviders.join(', ')}. Use one of those methods to sign in.`;
      } else if (hasPassword && (hasGoogle || hasOtherProviders)) {
        message = `This account can be signed in with: ${providers.join(', ')}`;
      } else if (hasPassword) {
        message = 'Email/password authentication is available.';
      } else {
        message = 'No authentication method found for this email.';
      }

      return {
        email,
        hasPassword,
        hasGoogle,
        hasOtherProviders,
        availableProviders: providers,
        message,
      };
    } catch (error: any) {
      throw new Error(`Failed to check providers: ${error.message}`);
    }
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
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);

        // Firebase returns error as { error: { code: 400, message: "ERROR_CODE" } }
        const firebaseErrorMessage =
          error.response.data?.error?.message || 'API request failed';
        console.error('Firebase error message:', firebaseErrorMessage);

        throw new Error(firebaseErrorMessage);
      }
      throw error;
    }
  }

  async validateRequestAndGetToken(
    req: any,
  ): Promise<firebaseAdmin.auth.DecodedIdToken | null> {
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
    } catch (error: unknown) {
      const errorWithCode = error as any;
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Token verification failed:', message);
      if (errorWithCode.code === 'auth/id-token-expired') {
        console.error('Token has expired.');
      } else if (errorWithCode.code === 'auth/invalid-id-token') {
        console.error('Invalid ID token provided.');
      }
      return null;
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
    } catch (error: unknown) {
      console.error('Error listing users:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch users: ${message}`);
    }
  }

  /**
   * Find a user by their Firebase UID and return both Firebase and local user data
   * @param uid The Firebase UID of the user
   * @returns Combined user data in a format matching UserResponseEntity
   */
  async findOne(uid: string): Promise<EnhancedUserResponse> {
    try {
      // Get the Firebase user
      const firebaseUser = await firebaseAdmin.auth().getUser(uid);

      // Get the local user data with all fields needed for UserEntity
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
          password_hash: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          active_user_type: true,
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
            active_user_type: UserType.MEMBER,
            updatedAt: new Date(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            password_hash: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            active_user_type: true,
          },
        });

        return {
          localUser: newLocalUser as UserEntity,
        };
      }

      return {
        localUser: localUser as UserEntity,
      };
    } catch (error: unknown) {
      const errorWithCode = error as any;
      if (errorWithCode.code === 'auth/user-not-found') {
        // If Firebase user not found, check if local user exists
        const localUser = await this.databaseService.user.findUnique({
          where: { id: uid },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            password_hash: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            active_user_type: true,
          },
        });

        if (localUser) {
          // Local user exists but Firebase user doesn't - unusual situation
          console.warn(`Local user ${uid} exists but Firebase user is missing`);
          return {
            localUser: localUser as UserEntity,
          };
        }

        throw new NotFoundException(
          `User with ID ${uid} not found in Firebase or local database`,
        );
      }

      console.error(`Error fetching user with ID ${uid}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch user: ${message}`);
    }
  }

  /**
   * Find a user by email address
   * @param email The email to search for
   * @returns User if found, null otherwise
   */
  async getUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password_hash: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          active_user_type: true,
        },
      });

      return (user as UserEntity) || null;
    } catch (error: unknown) {
      // If user not found, return null (not an error for this method)
      if ((error as any).code === 'P2025') {
        return null;
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error getting user by email ${email}:`, message);
      return null;
    }
  }

  /**
   * Update a user's information in both Firebase and local database
   * @param uid The Firebase UID of the user to update
   * @param updateUserDto The data to update
   * @returns Updated Firebase user record
   */
  async update(
    uid: string,
    updateUserDto: UpdateUserDto,
  ): Promise<firebaseAdmin.auth.UserRecord> {
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
    } catch (error: unknown) {
      const errorWithCode = error as any;
      if (errorWithCode.code === 'auth/user-not-found') {
        throw new NotFoundException(`User with ID ${uid} not found`);
      }
      console.error(`Error updating user with ID ${uid}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to update user: ${message}`);
    }
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
  async updateLocalUser(
    uid: string,
    updateData: Partial<UpdateUserDto>,
  ): Promise<UserEntity> {
    try {
      // First check if user exists in local database
      const existingUser = await this.databaseService.user.findFirst({
        where: {
          id: uid,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password_hash: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          active_user_type: true,
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
        updateFields.active_user_type = updateData.activeUserType;
      }

      // Add any other fields that should be updatable

      // Update the user in a transaction
      const updatedUser = await this.databaseService.$transaction(
        async (prisma: any) => {
          return prisma.user.update({
            where: { id: existingUser.id },
            data: updateFields,
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              password_hash: true,
              role: true,
              createdAt: true,
              updatedAt: true,
              active_user_type: true,
            },
          });
        },
      );

      return updatedUser as UserEntity;
    } catch (error) {
      console.error(`Error updating local user with ID ${uid}:`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to update local user: ${message}`);
    }
  }

  /**
   * Remove a user from both Firebase and the local database
   * @param uid The Firebase UID of the user to remove
   * @returns Success message
   */
  async remove(uid: string): Promise<{ success: boolean; message: string }> {
    try {
      // Use a transaction to delete both Firebase and local user
      await this.databaseService.$transaction(async (prisma: any) => {
        // First try to find and delete the local user
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

        // Then delete the Firebase user
        await firebaseAdmin.auth().deleteUser(uid);
      });

      return {
        success: true,
        message: `User with ID ${uid} successfully deleted from both Firebase and local database`,
      };
    } catch (error: unknown) {
      const errorWithCode = error as any;
      if (errorWithCode.code === 'auth/user-not-found') {
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
        } catch (localError: unknown) {
          console.error(
            `Error deleting local user with ID ${uid}:`,
            localError,
          );
          const message =
            localError instanceof Error ? localError.message : 'Unknown error';
          throw new BadRequestException(
            `Failed to delete local user: ${message}`,
          );
        }
      }

      console.error(`Error deleting user with ID ${uid}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to delete user: ${message}`);
    }
  }
}

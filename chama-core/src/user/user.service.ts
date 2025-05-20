import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

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

@Injectable()
export class UserService {

  constructor(private databaseService: PrismaService)  {}

  async registerUser(registerUser: RegisterUserDto) {
    console.log(registerUser);
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: registerUser.firstName,
        email: registerUser.email,
        password: registerUser.password,
      });
      console.log('User Record:', userRecord);

      //  create local user
      this.databaseService.user.create({
        data: {
          email: registerUser.email,
        },
      })
      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User registration failed'); 
    }
  }

  async loginUser(payload: LoginDto) {
    const { email, password } = payload;
    try {
      const response = await this.signInWithEmailAndPassword(email, password);
      
      // Ensure response contains the expected properties before destructuring
      if (!response || !response.idToken) {
        throw new Error('Authentication failed: Invalid response from Firebase');
      }
      
      const { idToken, refreshToken, expiresIn } = response;
      return { idToken, refreshToken, expiresIn };
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
      throw new Error('Firebase API key is not configured. Please set the FIREBASE_API_KEY environment variable.');
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
        throw new Error(error.response.data?.error?.message || 'API request failed');
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
      const listUsersResult = await firebaseAdmin.auth().listUsers(
        maxResults,
        params?.pageToken
      );
      
      return {
        users: listUsersResult.users,
        pageToken: listUsersResult.pageToken,
      };
    } catch (error) {
      console.error('Error listing users:', error);
      throw new BadRequestException(`Failed to fetch users: ${error.message}`);
    }
  }

  async findOne(uid: string): Promise<firebaseAdmin.auth.UserRecord> {
    try {
      const userRecord = await firebaseAdmin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundException(`User with ID ${uid} not found`);
      }
      console.error(`Error fetching user with ID ${uid}:`, error);
      throw new BadRequestException(`Failed to fetch user: ${error.message}`);
    }
  }

  async update(uid: string, updateUserDto: UpdateUserDto) {
    try {
      const userRecord = await firebaseAdmin.auth().updateUser(uid, updateUserDto);
      return userRecord;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundException(`User with ID ${uid} not found`);
      }
      console.error(`Error updating user with ID ${uid}:`, error);
      throw new BadRequestException(`Failed to update user: ${error.message}`);
    }
  }

  async remove(uid: string) {
    try {
      await firebaseAdmin.auth().deleteUser(uid);
      return { success: true, message: `User with ID ${uid} successfully deleted` };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundException(`User with ID ${uid} not found`);
      }
      console.error(`Error deleting user with ID ${uid}:`, error);
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
  }
}

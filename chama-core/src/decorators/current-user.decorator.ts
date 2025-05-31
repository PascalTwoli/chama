import { createParamDecorator, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { PrismaService } from '../prisma/prisma.service';

export interface CurrentUser {
  id: string;         // Database user ID
  firebaseUid: string; // Firebase UID
  email?: string;
  displayName?: string;
}

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<CurrentUser> => {
    const request = ctx.switchToHttp().getRequest();
    
    // Extract token from request
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not provided');
    }
    
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format. Expected "Bearer <token>"');
    }
    
    try {
      // Verify Firebase token
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      
      // Get PrismaService from the request (injected by guard)
      const prisma = request.prisma as PrismaService;
      if (!prisma) {
        throw new Error('PrismaService not available in request context');
      }
      
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: decodedToken.email },
      });
      
      // If user doesn't exist, create one
      if (!user && decodedToken.email) {
        user = await prisma.user.create({
          data: {
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email.split('@')[0],
            activeUserType: 'MEMBER', // Default to MEMBER user type
          },
        });
      }
      
      if (!user) {
        throw new BadRequestException('User account not found and could not be created');
      }
      
      return {
        id: user.id,
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
      };
    } catch (error) {
      if (error.code === 'auth/id-token-expired') {
        throw new UnauthorizedException('Authentication token has expired');
      } else if (error.code === 'auth/invalid-id-token') {
        throw new UnauthorizedException('Invalid authentication token');
      } else if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      } else {
        console.error('Error verifying token:', error);
        throw new UnauthorizedException('Authentication failed');
      }
    }
  },
);


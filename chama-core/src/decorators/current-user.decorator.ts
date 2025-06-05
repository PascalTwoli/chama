import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CurrentUser {
  id: string; // Database user ID
  firebaseUid: string; // Firebase UID
  email?: string;
  displayName?: string;
}

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<CurrentUser> => {
    const request = ctx.switchToHttp().getRequest();

    // Get decoded token from guard
    const decodedToken = request.decodedToken;
    if (!decodedToken) {
      throw new UnauthorizedException('Token not verified');
    }

    // Get PrismaService from request
    const prisma = request.prisma as PrismaService;
    if (!prisma) {
      throw new Error('PrismaService not available in request context');
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: decodedToken.email },
    });

    if (!user && decodedToken.email) {
      user = await prisma.user.create({
        data: {
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          activeUserType: 'MEMBER',
        },
      });
    }

    if (!user) {
      throw new BadRequestException(
        'User account not found and could not be created',
      );
    }

    return {
      id: user.id,
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };
  },
);

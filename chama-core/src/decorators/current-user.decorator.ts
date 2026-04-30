import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '@prisma/client';
import { validateFirebaseUid } from '../utils/firebase-uid.validator';

const logger = new Logger('CurrentUser');

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

    // Validate that the Firebase UID from token is in correct format
    // This prevents any malformed tokens from creating invalid user records
    try {
      validateFirebaseUid(decodedToken.uid);
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid Firebase UID format in token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    // Get PrismaService from request
    const prisma = request.prisma as PrismaService;
    if (!prisma) {
      throw new Error('PrismaService not available in request context');
    }

    // Find user by Firebase UID first (primary key)
    let user = await prisma.user.findUnique({
      where: { id: decodedToken.uid },
    });

    // If not found by Firebase UID, try to find by email (handles backward compatibility)
    // This should only match existing accounts created before Firebase UID was enforced
    if (!user && decodedToken.email) {
      user = await prisma.user.findFirst({
        where: { email: decodedToken.email },
      });

      // If found by email but has different ID, we have a mismatch
      // This indicates an old account created with a different ID system
      if (user && user.id !== decodedToken.uid) {
        // Backward compatibility: account created before Firebase UID enforcement.
        // TODO: Migrate old accounts so their DB id matches their Firebase UID.
        logger.warn(
          `User ${decodedToken.email} has mismatched ID: DB="${user.id}" Firebase="${decodedToken.uid}". ` +
          `Authenticated with existing record — migration needed.`,
        );
      }
    }

    // If still not found, create a new user with Firebase UID as primary key
    // This ensures all new accounts use Firebase UID as the database ID
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: decodedToken.uid, // Use Firebase UID as primary key for consistency
          email: decodedToken.email || '',
          name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
          active_user_type: UserType.MEMBER,
          updatedAt: new Date(),
        },
      });

      logger.log(`New user provisioned: ${decodedToken.email}`);
    }

    return {
      id: user.id,
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };
  },
);

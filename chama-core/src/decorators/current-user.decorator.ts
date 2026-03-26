import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '@prisma/client';
import { validateFirebaseUid } from '../utils/firebase-uid.validator';

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
        console.warn(
          `[AUTH WARNING] User ${decodedToken.email} has mismatched ID:` +
          ` Database ID="${user.id}" but Firebase UID="${decodedToken.uid}". ` +
          `This usually means an account was created before Firebase UID enforcement. ` +
          `The user will be authenticated but this should be resolved.`,
        );
        // Note: We still use this user to maintain backward compatibility
        // But ideally, accounts should be migrated to use Firebase UID as the ID
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

      console.log(
        `[AUTH] Created new user with Firebase UID: ${decodedToken.uid.substring(0, 10)}... for ${decodedToken.email}`,
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

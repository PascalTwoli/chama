import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';

export const PERMISSION_KEY = 'requiredPermission';

/**
 * Decorator to mark a route with a required permission key.
 * Usage: @RequirePermission('record_contributions')
 */
export const RequirePermission = (permissionKey: string) =>
  SetMetadata(PERMISSION_KEY, permissionKey);

/**
 * Guard that checks if the current user has the required permission
 * for the chama specified in the request (query param or route param).
 *
 * System roles OWNER/ADMIN bypass permission checks.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permission is required, allow access
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.decodedToken?.uid;

    // Try to get chamaId from query, params, or body
    const chamaId =
      request.query?.chamaId ||
      request.params?.chamaId ||
      request.body?.chamaId;

    if (!chamaId) {
      throw new ForbiddenException(
        'chamaId is required for permission check',
      );
    }

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Look up the database user ID from the decoded token email
    const prisma = request.prisma;
    if (!prisma) {
      throw new ForbiddenException('Service unavailable');
    }

    const user = await prisma.user.findUnique({
      where: { email: request.decodedToken?.email },
      select: { id: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const allowed = await this.rolesPermissionsService.requirePermission(
      user.id,
      chamaId,
      requiredPermission,
    );

    if (!allowed) {
      throw new ForbiddenException(
        `You do not have the '${requiredPermission}' permission`,
      );
    }

    return true;
  }
}

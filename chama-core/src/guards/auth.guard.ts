import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Inject PrismaService into the request
    request.prisma = this.prismaService;

    // Extract token with fallback strategy:
    // 1. Authorization: Bearer <token> header (priority)
    // 2. auth_token cookie (fallback)
    // 3. admin_token cookie (for admin routes)
    let token: string | null = null;
    
    // Try to get token from Authorization header first
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const [bearer, headerToken] = authHeader.split(' ');
      if (bearer === 'Bearer' && headerToken) {
        token = headerToken;
      }
    }
    
    // If no valid Authorization header, try cookies
    if (!token && request.cookies) {
      // Try auth_token cookie first
      token = request.cookies['auth_token'];
      
      // If no auth_token and this might be an admin route, try admin_token
      if (!token && request.url?.includes('/admin')) {
        token = request.cookies['admin_token'];
      }
    }
    
    // If still no token found, deny access
    if (!token) {
      throw new UnauthorizedException(
        'Authentication required: No valid token found in Authorization header or cookies'
      );
    }

    // Create a modified request with the Authorization header for validation
    const modifiedRequest = {
      ...request,
      headers: {
        ...request.headers,
        authorization: `Bearer ${token}`,
      },
    };

    // Validate token using UserService
    const decodedToken = await this.userService.validateRequestAndGetToken(modifiedRequest);
    if (!decodedToken) {
      throw new UnauthorizedException('Token verification failed');
    }

    // Attach decoded token to request
    request.decodedToken = decodedToken;
    return true;
  }
}

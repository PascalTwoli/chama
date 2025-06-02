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

    // Extract and verify token
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not provided');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Invalid authorization format. Expected "Bearer <token>"',
      );
    }

    // Validate token using UserService
    const decodedToken =
      await this.userService.validateRequestAndGetToken(request);
    if (!decodedToken) {
      throw new UnauthorizedException('Token verification failed');
    }

    // Attach decoded token to request
    request.decodedToken = decodedToken;
    return true;
  }
}

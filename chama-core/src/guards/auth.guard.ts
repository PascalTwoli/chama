import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService
  ) {}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Inject the PrismaService into the request object so it can be used by decorators
    request.prisma = this.prismaService;
    
    // Validate the request
    return this.userService.validateRequest(request);
  }
}

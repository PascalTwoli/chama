import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthGuard implements CanActivate {
    private userService;
    private prismaService;
    constructor(userService: UserService, prismaService: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

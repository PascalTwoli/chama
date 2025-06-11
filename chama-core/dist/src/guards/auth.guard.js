"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthGuard = class AuthGuard {
    userService;
    prismaService;
    constructor(userService, prismaService) {
        this.userService = userService;
        this.prismaService = prismaService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        request.prisma = this.prismaService;
        let token = null;
        const authHeader = request.headers['authorization'];
        if (authHeader) {
            const [bearer, headerToken] = authHeader.split(' ');
            if (bearer === 'Bearer' && headerToken) {
                token = headerToken;
            }
        }
        if (!token && request.cookies) {
            token = request.cookies['auth_token'];
            if (!token && request.url?.includes('/admin')) {
                token = request.cookies['admin_token'];
            }
        }
        if (!token) {
            throw new common_1.UnauthorizedException('Authentication required: No valid token found in Authorization header or cookies');
        }
        const modifiedRequest = {
            ...request,
            headers: {
                ...request.headers,
                authorization: `Bearer ${token}`,
            },
        };
        const decodedToken = await this.userService.validateRequestAndGetToken(modifiedRequest);
        if (!decodedToken) {
            throw new common_1.UnauthorizedException('Token verification failed');
        }
        request.decodedToken = decodedToken;
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        prisma_service_1.PrismaService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map
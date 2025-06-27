"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const request = ctx.switchToHttp().getRequest();
    // Get decoded token from guard
    const decodedToken = request.decodedToken;
    if (!decodedToken) {
        throw new common_1.UnauthorizedException('Token not verified');
    }
    // Get PrismaService from request
    const prisma = request.prisma;
    if (!prisma) {
        throw new Error('PrismaService not available in request context');
    }
    // Find or create user
    let user = yield prisma.user.findUnique({
        where: { email: decodedToken.email },
    });
    if (!user && decodedToken.email) {
        user = yield prisma.user.create({
            data: {
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email.split('@')[0],
                activeUserType: 'MEMBER',
            },
        });
    }
    if (!user) {
        throw new common_1.BadRequestException('User account not found and could not be created');
    }
    return {
        id: user.id,
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
    };
}));

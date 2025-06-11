"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)(async (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const decodedToken = request.decodedToken;
    if (!decodedToken) {
        throw new common_1.UnauthorizedException('Token not verified');
    }
    const prisma = request.prisma;
    if (!prisma) {
        throw new Error('PrismaService not available in request context');
    }
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
        throw new common_1.BadRequestException('User account not found and could not be created');
    }
    return {
        id: user.id,
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
    };
});
//# sourceMappingURL=current-user.decorator.js.map
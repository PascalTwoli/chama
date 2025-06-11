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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InviteService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
let InviteService = InviteService_1 = class InviteService {
    prisma;
    emailService;
    configService;
    logger = new common_1.Logger(InviteService_1.name);
    baseUrl;
    constructor(prisma, emailService, configService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.configService = configService;
        this.baseUrl = this.configService.get('APP_BASE_URL', 'http://localhost:3000');
    }
    async createInvite(createInviteDto, requestUserId, sendEmail = false) {
        const { chamaId, email } = createInviteDto;
        try {
            const requestingUser = await this.prisma.user.findUnique({
                where: { id: requestUserId },
                select: { id: true, name: true, email: true }
            });
            if (!requestingUser) {
                throw new common_1.BadRequestException('User not found');
            }
            const chama = await this.prisma.chama.findUnique({
                where: { id: chamaId },
                include: {
                    memberships: {
                        where: {
                            userId: requestUserId,
                        },
                    },
                },
            });
            if (!chama) {
                throw new common_1.NotFoundException(`Chama with ID ${chamaId} not found`);
            }
            const isUserAdmin = chama.memberships.some((membership) => membership.role === client_1.UserRole.ADMIN);
            this.logger.debug(`Invite permission check for user ${requestUserId} in chama ${chamaId}: isAdmin=${isUserAdmin}`);
            if (!isUserAdmin) {
                throw new common_1.UnauthorizedException('Only chama admins can send invites');
            }
            let targetUser = await this.prisma.user.findUnique({
                where: { email },
            });
            if (targetUser) {
                const existingMembership = await this.prisma.membership.findFirst({
                    where: {
                        chamaId,
                        userId: targetUser.id,
                    },
                });
                if (existingMembership) {
                    throw new common_1.ConflictException(`User with email ${email} is already a member of this chama`);
                }
            }
            const existingInvite = await this.prisma.invite.findFirst({
                where: {
                    chamaId,
                    sentToEmail: email,
                    usedAt: null,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
            });
            if (existingInvite) {
                throw new common_1.ConflictException(`An active invite already exists for ${email} in this chama`);
            }
            const token = (0, crypto_1.randomBytes)(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            const invite = await this.prisma.invite.create({
                data: {
                    chamaId,
                    token,
                    sentToEmail: email,
                    expiresAt,
                },
                include: {
                    chama: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    },
                },
            });
            const inviteLink = `${this.baseUrl}/join-chama/${token}`;
            if (sendEmail && this.emailService) {
                await this.sendInviteEmail(email, invite.chama.name, token, requestingUser.name || 'A Chama Admin');
            }
            return {
                invite,
                inviteLink
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Error creating invite: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to create invite');
        }
    }
    async validateAndAcceptInvite(token, userId) {
        try {
            const invite = await this.prisma.invite.findUnique({
                where: { token },
                include: {
                    chama: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    }
                },
            });
            if (!invite) {
                throw new common_1.NotFoundException('Invite not found');
            }
            if (invite.expiresAt < new Date()) {
                throw new common_1.BadRequestException('Invite has expired');
            }
            if (invite.usedAt) {
                throw new common_1.BadRequestException('Invite has already been used');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, email: true }
            });
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            if (!user.email) {
                throw new common_1.BadRequestException('User does not have an email address');
            }
            if (invite.sentToEmail.toLowerCase() !== user.email.toLowerCase()) {
                throw new common_1.UnauthorizedException('This invite was not sent to your email address');
            }
            const existingMembership = await this.prisma.membership.findFirst({
                where: {
                    chamaId: invite.chamaId,
                    userId,
                },
            });
            if (existingMembership) {
                throw new common_1.ConflictException('You are already a member of this chama');
            }
            const result = await this.prisma.$transaction(async (prisma) => {
                await prisma.invite.update({
                    where: { id: invite.id },
                    data: { usedAt: new Date() },
                });
                const membership = await prisma.membership.create({
                    data: {
                        userId,
                        chamaId: invite.chamaId,
                        role: client_1.UserRole.MEMBER,
                    },
                    include: {
                        chama: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        },
                        user: {
                            select: {
                                id: true,
                                email: true,
                                name: true,
                                phone: true,
                                createdAt: true,
                                updatedAt: true,
                                activeUserType: true
                            }
                        }
                    },
                });
                return membership;
            });
            this.logger.log(`User ${userId} successfully accepted invite to join chama ${invite.chamaId}`);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Error accepting invite: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to accept invite');
        }
    }
    async listPendingInvites(chamaId, requestUserId) {
        const chama = await this.prisma.chama.findUnique({
            where: { id: chamaId },
            include: {
                memberships: {
                    where: {
                        userId: requestUserId,
                    },
                },
            },
        });
        if (!chama) {
            throw new common_1.NotFoundException(`Chama with ID ${chamaId} not found`);
        }
        const isChamaAdmin = chama.memberships.some((membership) => membership.role === client_1.UserRole.ADMIN);
        if (!isChamaAdmin && chama.userId !== requestUserId) {
            throw new common_1.UnauthorizedException('Only chama admins can view pending invites');
        }
        const pendingInvites = await this.prisma.invite.findMany({
            where: {
                chamaId,
                usedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                chama: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return pendingInvites;
    }
    async getPendingInvitesForUser(email) {
        const pendingInvites = await this.prisma.invite.findMany({
            where: {
                sentToEmail: email,
                usedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                chama: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return pendingInvites;
    }
    async checkExistingInvite(chamaId, email) {
        const existingInvite = await this.prisma.invite.findFirst({
            where: {
                chamaId,
                sentToEmail: email,
                usedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
        return !!existingInvite;
    }
    async sendInviteEmail(email, chamaName, token, inviterName) {
        if (!this.emailService) {
            this.logger.warn('Email service not available - invite email not sent');
            return false;
        }
        try {
            const emailSent = await this.emailService.sendInviteEmail(email, chamaName, token, inviterName);
            if (emailSent) {
                this.logger.log(`Invite email sent to ${email} for chama ${chamaName}`);
                return true;
            }
            else {
                this.logger.warn(`Failed to send invite email to ${email} for chama ${chamaName}`);
                return false;
            }
        }
        catch (error) {
            this.logger.error(`Error sending invite email: ${error.message}`, error.stack);
            return false;
        }
    }
    generateInviteLink(token) {
        return `${this.baseUrl}/join-chama/${token}`;
    }
};
exports.InviteService = InviteService;
exports.InviteService = InviteService = InviteService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        config_1.ConfigService])
], InviteService);
//# sourceMappingURL=invite.service.js.map
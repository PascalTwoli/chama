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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
    constructor(prisma, emailService, configService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.configService = configService;
        this.logger = new common_1.Logger(InviteService_1.name);
        this.baseUrl = this.configService.get('APP_BASE_URL', 'http://localhost:3000');
    }
    /**
     * Create a new invite for a user to join a chama
     */
    createInvite(createInviteDto_1, requestUserId_1) {
        return __awaiter(this, arguments, void 0, function* (createInviteDto, requestUserId, sendEmail = false) {
            const { chamaId, email } = createInviteDto;
            try {
                // Get the requesting user
                const requestingUser = yield this.prisma.user.findUnique({
                    where: { id: requestUserId },
                    select: { id: true, name: true, email: true }
                });
                if (!requestingUser) {
                    throw new common_1.BadRequestException('User not found');
                }
                // Check if chama exists
                const chama = yield this.prisma.chama.findUnique({
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
                // Verify the requesting user is an admin of the chama
                // Note: memberships array is already filtered to only include the requesting user's memberships from the query above
                const isUserAdmin = chama.memberships.some((membership) => membership.role === client_1.UserRole.CHAIRPERSON);
                this.logger.debug(`Invite permission check for user ${requestUserId} in chama ${chamaId}: isAdmin=${isUserAdmin}`);
                if (!isUserAdmin) {
                    throw new common_1.UnauthorizedException('Only chama admins can send invites');
                }
                // Check if user with the email already exists
                let targetUser = yield this.prisma.user.findUnique({
                    where: { email },
                });
                // Check if the user is already a member of the chama
                if (targetUser) {
                    const existingMembership = yield this.prisma.membership.findFirst({
                        where: {
                            chamaId,
                            userId: targetUser.id,
                        },
                    });
                    if (existingMembership) {
                        throw new common_1.ConflictException(`User with email ${email} is already a member of this chama`);
                    }
                }
                // Check if an unused invite already exists for this email and chama
                const existingInvite = yield this.prisma.invite.findFirst({
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
                // Generate a secure random token
                const token = (0, crypto_1.randomBytes)(32).toString('hex');
                // Set expiration date (7 days from now)
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);
                // Create the invite
                const invite = yield this.prisma.invite.create({
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
                // Generate the invite link
                const inviteLink = `${this.baseUrl}/join-chama/${token}`;
                // Send invite email if requested and email service is available
                if (sendEmail && this.emailService) {
                    yield this.sendInviteEmail(email, invite.chama.name, token, requestingUser.name || 'A Chama Admin');
                }
                return {
                    invite,
                    inviteLink
                };
            }
            catch (error) {
                // Pass through known error types
                if (error instanceof common_1.NotFoundException ||
                    error instanceof common_1.BadRequestException ||
                    error instanceof common_1.ConflictException ||
                    error instanceof common_1.UnauthorizedException) {
                    throw error;
                }
                // Log and wrap unknown errors
                const message = error instanceof Error ? error.message : 'Unknown error';
                const stack = error instanceof Error ? error.stack : undefined;
                this.logger.error(`Error creating invite: ${message}`, stack);
                throw new common_1.InternalServerErrorException('Failed to create invite');
            }
        });
    }
    /**
     * Validate and accept an invite
     */
    validateAndAcceptInvite(token, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the invite by token
                const invite = yield this.prisma.invite.findUnique({
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
                // Check if invite is expired
                if (invite.expiresAt < new Date()) {
                    throw new common_1.BadRequestException('Invite has expired');
                }
                // Check if invite is already used
                if (invite.usedAt) {
                    throw new common_1.BadRequestException('Invite has already been used');
                }
                // Get user information
                const user = yield this.prisma.user.findUnique({
                    where: { id: userId },
                    select: { id: true, email: true }
                });
                if (!user) {
                    throw new common_1.BadRequestException('User not found');
                }
                if (!user.email) {
                    throw new common_1.BadRequestException('User does not have an email address');
                }
                // Check if the invite was sent to this user's email
                if (invite.sentToEmail.toLowerCase() !== user.email.toLowerCase()) {
                    throw new common_1.UnauthorizedException('This invite was not sent to your email address');
                }
                // Check if user is already a member of the chama
                const existingMembership = yield this.prisma.membership.findFirst({
                    where: {
                        chamaId: invite.chamaId,
                        userId,
                    },
                });
                if (existingMembership) {
                    throw new common_1.ConflictException('You are already a member of this chama');
                }
                // Create membership and mark invite as used in a transaction
                const result = yield this.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    // Mark invite as used
                    yield prisma.invite.update({
                        where: { id: invite.id },
                        data: { usedAt: new Date() },
                    });
                    // Create membership
                    const membership = yield prisma.membership.create({
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
                }));
                this.logger.log(`User ${userId} successfully accepted invite to join chama ${invite.chamaId}`);
                return result;
            }
            catch (error) {
                // Pass through known error types
                if (error instanceof common_1.NotFoundException ||
                    error instanceof common_1.BadRequestException ||
                    error instanceof common_1.ConflictException ||
                    error instanceof common_1.UnauthorizedException) {
                    throw error;
                }
                // Log and wrap unknown errors
                const message = error instanceof Error ? error.message : 'Unknown error';
                const stack = error instanceof Error ? error.stack : undefined;
                this.logger.error(`Error accepting invite: ${message}`, stack);
                throw new common_1.InternalServerErrorException('Failed to accept invite');
            }
        });
    }
    /**
     * List all pending invites for a chama
     */
    listPendingInvites(chamaId, requestUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify the chama exists
            const chama = yield this.prisma.chama.findUnique({
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
            // Verify the requesting user is an admin of the chama
            const isChamaAdmin = chama.memberships.some((membership) => membership.role === client_1.UserRole.CHAIRPERSON);
            if (!isChamaAdmin && chama.userId !== requestUserId) {
                throw new common_1.UnauthorizedException('Only chama admins can view pending invites');
            }
            // Get pending invites
            const pendingInvites = yield this.prisma.invite.findMany({
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
        });
    }
    /**
     * Get chamas where a user has been invited but not yet joined
     */
    getPendingInvitesForUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingInvites = yield this.prisma.invite.findMany({
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
        });
    }
    /**
     * Check if a user already has a pending invite to a chama
     */
    checkExistingInvite(chamaId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingInvite = yield this.prisma.invite.findFirst({
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
        });
    }
    /**
     * Helper method to send an invite email
     */
    sendInviteEmail(email, chamaName, token, inviterName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.emailService) {
                this.logger.warn('Email service not available - invite email not sent');
                return false;
            }
            try {
                const emailSent = yield this.emailService.sendInviteEmail(email, chamaName, token, inviterName);
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
                const message = error instanceof Error ? error.message : 'Unknown error';
                const stack = error instanceof Error ? error.stack : undefined;
                this.logger.error(`Error sending invite email: ${message}`, stack);
                return false;
            }
        });
    }
    /**
     * Generate an invite link for a token
     */
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

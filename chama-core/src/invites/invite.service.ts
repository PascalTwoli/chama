import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { randomBytes } from 'crypto';
import * as crypto from 'crypto';
import {
  invite as PrismaInvite,
  membership as PrismaMembership,
  user_role,
  user as PrismaUser,
} from '@prisma/client';
import * as firebaseAdmin from 'firebase-admin';
import { InviteEntity } from './entities/invite.entity';
import { MembershipEntity } from './entities/membership.entity';

@Injectable()
export class InviteService {
  private readonly logger = new Logger(InviteService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'APP_BASE_URL',
      'http://localhost:3000',
    );
  }

  /**
   * Create a new invite for a user to join a chama
   */
  async createInvite(
    createInviteDto: CreateInviteDto,
    requestUserId: string,
    sendEmail: boolean = false,
  ): Promise<{ invite: PrismaInvite; inviteLink: string }> {
    const { chamaId, email } = createInviteDto;

    try {
      // Get the requesting user
      const requestingUser = await this.prisma.user.findUnique({
        where: { id: requestUserId },
        select: { id: true, name: true, email: true },
      });

      if (!requestingUser) {
        throw new BadRequestException('User not found');
      }

      // Check if chama exists
      const chama = await this.prisma.chama.findUnique({
        where: { id: chamaId },
        include: {
          membership: {
            where: {
              user_id: requestUserId,
            },
          },
        },
      });

      if (!chama) {
        throw new NotFoundException(`Chama with ID ${chamaId} not found`);
      }

      // Verify the requesting user is an admin of the chama
      // Note: membership array is already filtered to only include the requesting user's memberships from the query above
      const isUserAdmin = chama.membership.some(
        membership => membership.role === user_role.CHAIRPERSON,
      );

      this.logger.debug(
        `Invite permission check for user ${requestUserId} in chama ${chamaId}: isAdmin=${isUserAdmin}`,
      );

      if (!isUserAdmin) {
        throw new UnauthorizedException('Only chama admins can send invites');
      }

      // Check if user with the email already exists
      let targetUser = await this.prisma.user.findUnique({
        where: { email },
      });

      // Check if the user is already a member of the chama
      if (targetUser) {
        const existingMembership = await this.prisma.membership.findFirst({
          where: {
            chama_id: chamaId,
            user_id: targetUser.id,
          },
        });

        if (existingMembership) {
          throw new ConflictException(
            `User with email ${email} is already a member of this chama`,
          );
        }
      }

      // Check if an unused invite already exists for this email and chama
      const existingInvite = await this.prisma.invite.findFirst({
        where: {
          chama_id: chamaId,
          sent_to_email: email,
          used_at: null,
          expires_at: {
            gt: new Date(),
          },
        },
      });

      if (existingInvite) {
        throw new ConflictException(
          `An active invite already exists for ${email} in this chama`,
        );
      }

      // Generate a secure random token
      const token = randomBytes(32).toString('hex');

      // Set expiration date (7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Create the invite
      const invite = await this.prisma.invite.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          token,
          sent_to_email: email,
          expires_at: expiresAt,
        },
        include: {
          chama: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      // Generate the invite link
      const inviteLink = `${this.baseUrl}/join-chama/${token}`;

      // Send invite email if requested and email service is available
      if (sendEmail && this.emailService) {
        await this.sendInviteEmail(
          email,
          invite.chama.name,
          token,
          requestingUser.name || 'A Chama Admin',
        );
      }

      return {
        invite,
        inviteLink,
      };
    } catch (error) {
      // Pass through known error types
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Log and wrap unknown errors
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error creating invite: ${message}`, stack);
      throw new InternalServerErrorException('Failed to create invite');
    }
  }

  /**
   * Validate an invite token and return invite details
   */
  async validateInvite(
    token: string,
  ): Promise<
    PrismaInvite & {
      chama: { name: string; id: string; description: string | null };
    }
  > {
    // Find the invite by token
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: {
        chama: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    // Check if invite is expired
    if (invite.expires_at < new Date()) {
      throw new BadRequestException('Invite has expired');
    }

    // Check if invite is already used
    if (invite.used_at) {
      throw new BadRequestException('Invite has already been used');
    }

    return invite;
  }

  /**
   * Validate and accept an invite
   */
  async validateAndAcceptInvite(
    token: string,
    userId: string,
  ): Promise<PrismaMembership> {
    try {
      // Find the invite by token
      const invite = await this.prisma.invite.findUnique({
        where: { token },
        include: {
          chama: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      if (!invite) {
        throw new NotFoundException('Invite not found');
      }

      // Check if invite is expired
      if (invite.expires_at < new Date()) {
        throw new BadRequestException('Invite has expired');
      }

      // Check if invite is already used
      if (invite.used_at) {
        throw new BadRequestException('Invite has already been used');
      }

      // Get user information
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (!user.email) {
        throw new BadRequestException('User does not have an email address');
      }

      // Check if the invite was sent to this user's email
      if (invite.sent_to_email.toLowerCase() !== user.email.toLowerCase()) {
        throw new UnauthorizedException(
          'This invite was not sent to your email address',
        );
      }

      // Check if user is already a member of the chama
      const existingMembership = await this.prisma.membership.findFirst({
        where: {
          chama_id: invite.chama_id,
          user_id: userId,
        },
      });

      if (existingMembership) {
        throw new ConflictException('You are already a member of this chama');
      }

      // Create membership and mark invite as used in a transaction
      const result = await this.prisma.$transaction(async prisma => {
        // Mark invite as used
        await prisma.invite.update({
          where: { id: invite.id },
          data: { used_at: new Date() },
        });

        // Create membership
        const membership = await prisma.membership.create({
          data: {
            id: crypto.randomUUID(),
            user_id: userId,
            chama_id: invite.chama_id,
            role: user_role.MEMBER,
            updatedAt: new Date(),
          },
          include: {
            chama: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                createdAt: true,
                updatedAt: true,
                active_user_type: true,
              },
            },
          },
        });

        return membership;
      });

      this.logger.log(
        `User ${userId} successfully accepted invite to join chama ${invite.chama_id}`,
      );
      return result;
    } catch (error) {
      // Pass through known error types
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Log and wrap unknown errors
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error accepting invite: ${message}`, stack);
      throw new InternalServerErrorException('Failed to accept invite');
    }
  }

  /**
   * List all pending invites for a chama
   */
  async listPendingInvites(
    chamaId: string,
    requestUserId: string,
  ): Promise<PrismaInvite[]> {
    // Verify the chama exists
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
      include: {
        membership: {
          where: {
            user_id: requestUserId,
          },
        },
      },
    });

    if (!chama) {
      throw new NotFoundException(`Chama with ID ${chamaId} not found`);
    }

    // Verify the requesting user is an admin of the chama
    const isChamaAdmin = chama.membership.some(
      membership => membership.role === user_role.CHAIRPERSON,
    );

    if (!isChamaAdmin && chama.created_by !== requestUserId) {
      throw new UnauthorizedException(
        'Only chama admins can view pending invites',
      );
    }

    // Get pending invites
    const pendingInvites = await this.prisma.invite.findMany({
      where: {
        chama_id: chamaId,
        used_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
      include: {
        chama: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pendingInvites;
  }

  /**
   * Get chamas where a user has been invited but not yet joined
   */
  async getPendingInvitesForUser(email: string): Promise<PrismaInvite[]> {
    const pendingInvites = await this.prisma.invite.findMany({
      where: {
        sent_to_email: email,
        used_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
      include: {
        chama: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pendingInvites;
  }

  /**
   * Check if a user already has a pending invite to a chama
   */
  async checkExistingInvite(chamaId: string, email: string): Promise<boolean> {
    const existingInvite = await this.prisma.invite.findFirst({
      where: {
        chama_id: chamaId,
        sent_to_email: email,
        used_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
    });

    return !!existingInvite;
  }
  /**
   * Helper method to send an invite email
   */
  async sendInviteEmail(
    email: string,
    chamaName: string,
    token: string,
    inviterName: string,
  ): Promise<boolean> {
    if (!this.emailService) {
      this.logger.warn('Email service not available - invite email not sent');
      return false;
    }

    try {
      const emailSent = await this.emailService.sendInviteEmail(
        email,
        chamaName,
        token,
        inviterName,
      );

      if (emailSent) {
        this.logger.log(`Invite email sent to ${email} for chama ${chamaName}`);
        return true;
      } else {
        this.logger.warn(
          `Failed to send invite email to ${email} for chama ${chamaName}`,
        );
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error sending invite email: ${message}`, stack);
      return false;
    }
  }

  /**
   * Generate an invite link for a token
   */
  generateInviteLink(token: string): string {
    return `${this.baseUrl}/join-chama/${token}`;
  }
}

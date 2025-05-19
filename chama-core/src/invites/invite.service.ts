import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ConflictException, 
  UnauthorizedException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { randomBytes } from 'crypto';
import { Invite, Membership, UserRole, User } from '../../generated/prisma';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class InviteService {
  private readonly logger = new Logger(InviteService.name);
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}

  /**
   * Create a new invite for a user to join a chama
   */
  async createInvite(createInviteDto: CreateInviteDto, requestUserId: string): Promise<Invite> {
    const { chamaId, email } = createInviteDto;

    try {
      // Get the requesting user
      const requestingUser = await this.prisma.user.findUnique({
        where: { id: requestUserId },
        select: { id: true, name: true, email: true }
      });

      if (!requestingUser) {
        throw new BadRequestException('User not found');
      }

      // Check if chama exists
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
        throw new NotFoundException(`Chama with ID ${chamaId} not found`);
      }

      // Verify the requesting user is an admin of the chama
      const isChamaAdmin = chama.memberships.some(
        (membership) => membership.role === UserRole.ADMIN
      );

      if (!isChamaAdmin && chama.userId !== requestUserId) {
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
            chamaId,
            userId: targetUser.id,
          },
        });

        if (existingMembership) {
          throw new ConflictException(`User with email ${email} is already a member of this chama`);
        }
      }

      // Check if an unused invite already exists for this email and chama
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
        throw new ConflictException(
          `An active invite already exists for ${email} in this chama`
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
          chamaId,
          token,
          sentToEmail: email,
          expiresAt,
        },
        include: {
          chama: true,
        },
      });

      // Send invite email
      try {
        const inviterName = requestingUser.name || 'A Chama Admin';
        
        const emailSent = await this.emailService.sendInviteEmail(
          email,
          invite.chama.name,
          token,
          inviterName
        );
        
        if (emailSent) {
          this.logger.log(`Invite email sent to ${email} for chama ${chamaId}`);
        } else {
          this.logger.warn(`Failed to send invite email to ${email} for chama ${chamaId}`);
        }
      } catch (error) {
        this.logger.error(`Error sending invite email: ${error.message}`, error.stack);
        // We don't throw here as the invite was created successfully
        // The user can still join with the token even if email delivery fails
      }

      return invite;
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
      this.logger.error(`Error creating invite: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create invite');
    }
  }

  /**
   * Validate and accept an invite
   */
  async validateAndAcceptInvite(token: string, userId: string): Promise<Membership> {
    try {
      // Find the invite by token
      const invite = await this.prisma.invite.findUnique({
        where: { token },
        include: { chama: true },
      });

      if (!invite) {
        throw new NotFoundException('Invite not found');
      }

      // Check if invite is expired
      if (invite.expiresAt < new Date()) {
        throw new BadRequestException('Invite has expired');
      }

      // Check if invite is already used
      if (invite.usedAt) {
        throw new BadRequestException('Invite has already been used');
      }

      // Get user information
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true }
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (!user.email) {
        throw new BadRequestException('User does not have an email address');
      }

      // Check if the invite was sent to this user's email
      if (invite.sentToEmail.toLowerCase() !== user.email.toLowerCase()) {
        throw new UnauthorizedException('This invite was not sent to your email address');
      }

      // Check if user is already a member of the chama
      const existingMembership = await this.prisma.membership.findFirst({
        where: {
          chamaId: invite.chamaId,
          userId,
        },
      });

      if (existingMembership) {
        throw new ConflictException('You are already a member of this chama');
      }

      // Create membership and mark invite as used in a transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        // Mark invite as used
        await prisma.invite.update({
          where: { id: invite.id },
          data: { usedAt: new Date() },
        });

        // Create membership
        const membership = await prisma.membership.create({
          data: {
            userId,
            chamaId: invite.chamaId,
            role: UserRole.MEMBER,
          },
          include: {
            chama: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          },
        });

        return membership;
      });

      this.logger.log(`User ${userId} successfully accepted invite to join chama ${invite.chamaId}`);
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
      this.logger.error(`Error accepting invite: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to accept invite');
    }
  }

  /**
   * List all pending invites for a chama
   */
  async listPendingInvites(
    chamaId: string, 
    requestUserId: string
  ): Promise<Invite[]> {
    // Verify the chama exists
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
      throw new NotFoundException(`Chama with ID ${chamaId} not found`);
    }

    // Verify the requesting user is an admin of the chama
    const isChamaAdmin = chama.memberships.some(
      (membership) => membership.role === UserRole.ADMIN
    );

    if (!isChamaAdmin && chama.userId !== requestUserId) {
      throw new UnauthorizedException('Only chama admins can view pending invites');
    }

    // Get pending invites
    const pendingInvites = await this.prisma.invite.findMany({
      where: {
        chamaId,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
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
  async getPendingInvitesForUser(email: string): Promise<Invite[]> {
    const pendingInvites = await this.prisma.invite.findMany({
      where: {
        sentToEmail: email,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        chama: true,
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
}


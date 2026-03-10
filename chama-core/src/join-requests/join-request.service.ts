import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { join_request, join_request_status, user_role } from '@prisma/client';

@Injectable()
export class JoinRequestService {
  private readonly logger = new Logger(JoinRequestService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new join request
   * Validates that user is not already a member and has no pending request
   */
  async createJoinRequest(
    userId: string,
    createDto: CreateJoinRequestDto,
  ): Promise<join_request> {
    const { chamaId, message } = createDto;

    // chamaId is required - it comes from URL param merged by controller
    if (!chamaId) {
      throw new NotFoundException('Chama ID is required');
    }

    try {
      // Validate chama exists
      const chama = await this.prisma.chama.findUnique({
        where: { id: chamaId },
      });

      if (!chama) {
        throw new NotFoundException(`Chama with ID ${chamaId} not found`);
      }

      // Check user is not already a member
      const existingMembership = await this.prisma.membership.findFirst({
        where: {
          chama_id: chamaId,
          user_id: userId,
        },
      });

      if (existingMembership) {
        throw new ConflictException('You are already a member of this chama');
      }

      // Check no pending request exists
      const existingRequest = await this.prisma.join_request.findFirst({
        where: {
          chama_id: chamaId,
          user_id: userId,
          status: join_request_status.PENDING,
        },
      });

      if (existingRequest) {
        throw new ConflictException(
          'You already have a pending join request for this chama',
        );
      }

      // Create join request with PENDING status
      const joinRequest = await this.prisma.join_request.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: userId,
          status: join_request_status.PENDING,
          message,
          updatedAt: new Date(),
        },
        include: {
          user_join_request_user_idTouser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          chama: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      this.logger.log(
        `User ${userId} created join request for chama ${chamaId}`,
      );

      return joinRequest;
    } catch (error) {
      // Pass through known error types
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Log and wrap unknown errors
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error creating join request: ${message}`, stack);
      throw new InternalServerErrorException('Failed to create join request');
    }
  }

  /**
   * Get all pending join requests for a chama
   * Only accessible by chairpersons of the chama
   */
  async getPendingRequestsForChama(
    chamaId: string,
    requestUserId: string,
  ): Promise<join_request[]> {
    // Verify requester is chairperson
    await this.verifyChairperson(requestUserId, chamaId);

    // Query requests with status PENDING for chamaId
    const requests = await this.prisma.join_request.findMany({
      where: {
        chama_id: chamaId,
        status: join_request_status.PENDING,
      },
      include: {
        user_join_request_user_idTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    this.logger.log(
      `User ${requestUserId} retrieved ${requests.length} pending requests for chama ${chamaId}`,
    );

    return requests;
  }

  /**
   * Verify user is chairperson of a chama
   * @throws UnauthorizedException if user is not a chairperson
   */
  private async verifyChairperson(
    userId: string,
    chamaId: string,
  ): Promise<void> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        chama_id: chamaId,
        user_id: userId,
      },
    });

    if (!membership || membership.role !== user_role.CHAIRPERSON) {
      throw new UnauthorizedException(
        'Only chairpersons can perform this action',
      );
    }
  }

  /**
   * Approve a join request
   * Creates membership and updates request status
   */
  async approveJoinRequest(
    requestId: string,
    reviewerId: string,
    chamaId: string,
  ): Promise<{ joinRequest: join_request; membership: any }> {
    // Verify requester is chairperson
    await this.verifyChairperson(reviewerId, chamaId);

    try {
      // Use transaction to ensure atomicity
      const result = await this.prisma.$transaction(async tx => {
        // Validate request exists and is PENDING
        const request = await tx.join_request.findUnique({
          where: { id: requestId },
        });

        if (!request) {
          throw new NotFoundException(
            `Join request with ID ${requestId} not found`,
          );
        }

        if (request.status !== join_request_status.PENDING) {
          throw new ConflictException('Only pending requests can be approved');
        }

        if (request.chama_id !== chamaId) {
          throw new ConflictException('Request does not belong to this chama');
        }

        // Check user is not already a member
        const existingMembership = await tx.membership.findFirst({
          where: {
            chama_id: chamaId,
            user_id: request.user_id,
          },
        });

        if (existingMembership) {
          throw new ConflictException('User is already a member of this chama');
        }

        // Update request status to APPROVED
        const updatedRequest = await tx.join_request.update({
          where: { id: requestId },
          data: {
            status: join_request_status.APPROVED,
            reviewed_by: reviewerId,
            reviewed_at: new Date(),
            updatedAt: new Date(),
          },
          include: {
            user_join_request_user_idTouser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            chama: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        });

        // Create membership with MEMBER role
        const membership = await tx.membership.create({
          data: {
            id: crypto.randomUUID(),
            chama_id: chamaId,
            user_id: request.user_id,
            role: user_role.MEMBER,
            updatedAt: new Date(),
          },
        });

        return { joinRequest: updatedRequest, membership };
      });

      this.logger.log(
        `Reviewer ${reviewerId} approved join request ${requestId} for chama ${chamaId}`,
      );

      return result;
    } catch (error) {
      // Pass through known error types
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Log and wrap unknown errors
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error approving join request: ${message}`, stack);
      throw new InternalServerErrorException('Failed to approve join request');
    }
  }

  /**
   * Reject a join request
   * Updates request status without creating membership
   */
  async rejectJoinRequest(
    requestId: string,
    reviewerId: string,
    chamaId: string,
  ): Promise<join_request> {
    // Verify requester is chairperson
    await this.verifyChairperson(reviewerId, chamaId);

    try {
      // Validate request exists and is PENDING
      const request = await this.prisma.join_request.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException(
          `Join request with ID ${requestId} not found`,
        );
      }

      if (request.status !== join_request_status.PENDING) {
        throw new ConflictException('Only pending requests can be rejected');
      }

      if (request.chama_id !== chamaId) {
        throw new ConflictException('Request does not belong to this chama');
      }

      // Update request status to REJECTED
      const updatedRequest = await this.prisma.join_request.update({
        where: { id: requestId },
        data: {
          status: join_request_status.REJECTED,
          reviewed_by: reviewerId,
          reviewed_at: new Date(),
          updatedAt: new Date(),
        },
        include: {
          user_join_request_user_idTouser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          chama: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      this.logger.log(
        `Reviewer ${reviewerId} rejected join request ${requestId} for chama ${chamaId}`,
      );

      return updatedRequest;
    } catch (error) {
      // Pass through known error types
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Log and wrap unknown errors
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error rejecting join request: ${message}`, stack);
      throw new InternalServerErrorException('Failed to reject join request');
    }
  }

  /**
   * Get all join requests created by a user
   */
  async getUserJoinRequests(userId: string): Promise<join_request[]> {
    const requests = await this.prisma.join_request.findMany({
      where: {
        user_id: userId,
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

    this.logger.log(
      `User ${userId} retrieved ${requests.length} of their join requests`,
    );

    return requests;
  }
}

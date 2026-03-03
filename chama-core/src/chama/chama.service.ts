import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChamaDto } from './dto/create-chama.dto';
import { user_role, country } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class ChamaService {
  constructor(private prisma: PrismaService) {}

  async create(createChamaDto: CreateChamaDto, userId: string) {
    try {
      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const chamaId = crypto.randomUUID();

      // Create the chama with the creator as a member
      // Per foundational_role_structure.md:
      // - Creator is always OWNER (determined by created_by field)
      // - We also add them to membership with CHAIRPERSON role by default
      //   (they can change this later, but they get OWNER system access regardless)
      const chama = await this.prisma.chama.create({
        data: {
          id: chamaId,
          name: createChamaDto.name,
          description: createChamaDto.description,
          rules: createChamaDto.rules,
          created_by: user.id,
          country: createChamaDto.country || country.KENYA,
          members_count: createChamaDto.membersCount || 1,
          organization_role: createChamaDto.organizationRole,
          updatedAt: new Date(),
          // Create membership for the creator
          membership: {
            create: {
              id: crypto.randomUUID(),
              user_id: user.id,
              role: createChamaDto.organizationRole || user_role.CHAIRPERSON,
              updatedAt: new Date(),
            },
          },
        },
        include: {
          membership: true,
        },
      });

      return chama;
    } catch (error: unknown) {
      console.error('Error creating chama:', error);
      const errorWithCode = error as any;
      if (errorWithCode.code === 'P2002') {
        throw new BadRequestException('A chama with this name already exists');
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to create chama: ${message}`);
    }
  }

  async findAll(userId: string) {
    try {
      const chamas = await this.prisma.chama.findMany({
        where: {
          membership: {
            some: { user_id: userId },
          },
        },
        include: {
          membership: {
            where: { user_id: userId },
          },
          user: true, // Include the creator info
        },
      });

      // Governance roles that grant ADMIN system access (per foundational_role_structure.md)
      const governanceAdminRoles = [
        'CHAIRPERSON',
        'TREASURER',
        'SECRETARY',
        'VICE_CHAIR',
      ];

      // Transform the response following the role structure guidelines:
      // - System Roles: OWNER, ADMIN, MEMBER (determines dashboard access)
      // - Governance Roles: CHAIRPERSON, TREASURER, SECRETARY, etc. (organizational titles)
      return chamas.map(chama => {
        const userMembership = chama.membership[0]; // The user's membership
        const isOwner = chama.created_by === userId;

        // Get governance role from membership (this is the organizational title)
        const governanceRole = userMembership?.role?.toUpperCase() || null;

        // Determine system role:
        // 1. Creator is always OWNER
        // 2. Governance roles (CHAIRPERSON, TREASURER, SECRETARY) grant ADMIN access
        // 3. Everyone else is MEMBER
        let systemRole: string;
        if (isOwner) {
          systemRole = 'OWNER';
        } else if (
          governanceRole &&
          governanceAdminRoles.includes(governanceRole)
        ) {
          systemRole = 'ADMIN';
        } else {
          systemRole = 'MEMBER';
        }

        return {
          ...chama,
          // System role (OWNER/ADMIN/MEMBER) - determines admin dashboard access
          role: systemRole,
          // Governance/organizational role (CHAIRPERSON, TREASURER, etc.) - the title
          organizationRole: governanceRole !== 'MEMBER' ? governanceRole : null,
          isOwner: isOwner,
          joinedAt: userMembership?.joinedAt || chama.createdAt,
          createdBy: chama.created_by,
          membersCount: chama.members_count,
        };
      });
    } catch (error: unknown) {
      console.error('Error finding chamas:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch chamas: ${message}`);
    }
  }

  async findAllAvailable(userId: string) {
    try {
      // Get all chamas that the user is NOT already a member of
      const chamas = await this.prisma.chama.findMany({
        where: {
          NOT: {
            membership: {
              some: { user_id: userId },
            },
          },
        },
        include: {
          membership: true,
        },
      });
      return chamas;
    } catch (error: unknown) {
      console.error('Error finding available chamas:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to fetch available chamas: ${message}`,
      );
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const chama = await this.prisma.chama.findFirst({
        where: {
          id,
          membership: {
            some: { user_id: userId },
          },
        },
        include: {
          membership: true,
        },
      });
      if (!chama) {
        throw new NotFoundException(
          `Chama with ID ${id} not found or you don't have access`,
        );
      }
      return chama;
    } catch (error: unknown) {
      console.error(`Error finding chama with ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch chama: ${message}`);
    }
  }
}

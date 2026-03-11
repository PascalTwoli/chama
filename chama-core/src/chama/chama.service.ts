import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChamaDto } from './dto/create-chama.dto';
import { user_role, country, system_role } from '@prisma/client';
import * as crypto from 'crypto';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';

@Injectable()
export class ChamaService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => RolesPermissionsService))
    private rolesPermissionsService: RolesPermissionsService,
  ) {}

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

      // Seed global permissions (idempotent) and create default roles for this chama
      await this.rolesPermissionsService.seedPermissions();
      await this.rolesPermissionsService.createDefaultRolesForChama(chamaId);

      // Set creator's system_role to OWNER
      await this.prisma.user.update({
        where: { id: user.id },
        data: { system_role: system_role.OWNER },
      });

      // Assign creator the "Chairperson" organizational role
      const chairpersonRole = await this.prisma.role.findUnique({
        where: {
          chama_id_name: { chama_id: chamaId, name: 'Chairperson' },
        },
      });
      if (chairpersonRole) {
        await this.prisma.member_role.create({
          data: {
            user_id: user.id,
            chama_id: chamaId,
            role_id: chairpersonRole.id,
          },
        });
      }

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
          membership: {
            include: {
              user: true,
            },
          },
          user: true, // Include the creator
        },
      });

      // Map to a more useful response format
      return chamas.map((chama) => {
        // Find the chairperson/admin
        const chairperson = chama.membership.find(
          (m) => m.role === 'CHAIRPERSON',
        );
        const adminName = chairperson?.user?.name || chama.user?.name || null;

        return {
          id: chama.id,
          name: chama.name,
          description: chama.description,
          membersCount: chama.members_count,
          country: chama.country,
          createdAt: chama.createdAt,
          updatedAt: chama.updatedAt,
          adminName: adminName,
        };
      });
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

  async getChamaMembers(chamaId: string, userId: string) {
    try {
      // First verify the user is a member of this chama
      const membership = await this.prisma.membership.findFirst({
        where: {
          chama_id: chamaId,
          user_id: userId,
        },
      });

      if (!membership) {
        throw new NotFoundException(
          `Chama with ID ${chamaId} not found or you don't have access`,
        );
      }

      // Get all members with user details and RBAC role
      const [members, memberRoles] = await Promise.all([
        this.prisma.membership.findMany({
          where: { chama_id: chamaId },
          include: { user: true },
          orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
        }),
        this.prisma.member_role.findMany({
          where: { chama_id: chamaId },
          include: { role: true },
        }),
      ]);

      // Build a lookup: userId → RBAC role name
      const rbacRoleMap = new Map(
        memberRoles.map((mr) => [mr.user_id, mr.role]),
      );

      // Map to a cleaner response format
      return members.map((m) => {
        const rbacRole = rbacRoleMap.get(m.user_id);
        return {
          id: m.id,
          userId: m.user_id,
          role: m.role,
          orgRole: rbacRole
            ? { id: rbacRole.id, name: rbacRole.name }
            : null,
          joinedAt: m.joinedAt,
          createdAt: m.createdAt,
          user: {
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            phone: m.user.phone,
          },
        };
      });
    } catch (error: unknown) {
      console.error(`Error fetching members for chama ${chamaId}:`, error);
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch chama members: ${message}`);
    }
  }
}

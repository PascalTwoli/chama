import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { system_role } from '@prisma/client';
import {
  DEFAULT_PERMISSIONS,
  DEFAULT_ROLES,
} from './roles-permissions.constants';

@Injectable()
export class RolesPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Seed / Initialization ────────────────────────────────────────

  /**
   * Seed global permissions table (idempotent).
   */
  async seedPermissions(): Promise<void> {
    for (const perm of DEFAULT_PERMISSIONS) {
      await this.prisma.permission.upsert({
        where: { key: perm.key },
        update: { description: perm.description },
        create: { key: perm.key, description: perm.description },
      });
    }
  }

  /**
   * Create default organizational roles for a chama (idempotent).
   * Called during chama creation.
   */
  async createDefaultRolesForChama(chamaId: string): Promise<void> {
    const allPermissions = await this.prisma.permission.findMany();
    const permKeyToId = new Map(allPermissions.map((p) => [p.key, p.id]));

    for (const roleDef of DEFAULT_ROLES) {
      const existing = await this.prisma.role.findUnique({
        where: { chama_id_name: { chama_id: chamaId, name: roleDef.name } },
      });
      if (existing) continue;

      const permissionIds = roleDef.permissions
        .map((key) => permKeyToId.get(key))
        .filter((id): id is string => !!id);

      await this.prisma.role.create({
        data: {
          chama_id: chamaId,
          name: roleDef.name,
          description: roleDef.description,
          is_default: true,
          role_permissions: {
            create: permissionIds.map((pid) => ({
              permission_id: pid,
            })),
          },
        },
      });
    }
  }

  /**
   * Assign a member the "General Member" organizational role for a chama.
   */
  async assignDefaultRoleToMember(
    userId: string,
    chamaId: string,
  ): Promise<void> {
    const generalMemberRole = await this.prisma.role.findUnique({
      where: {
        chama_id_name: { chama_id: chamaId, name: 'General Member' },
      },
    });
    if (!generalMemberRole) return;

    await this.prisma.member_role.upsert({
      where: { user_id_chama_id: { user_id: userId, chama_id: chamaId } },
      update: { role_id: generalMemberRole.id },
      create: {
        user_id: userId,
        chama_id: chamaId,
        role_id: generalMemberRole.id,
      },
    });
  }

  // ─── Permission Check ────────────────────────────────────────────

  /**
   * Check if a user has a specific permission in a chama.
   * System roles OWNER/ADMIN bypass all checks.
   */
  async requirePermission(
    userId: string,
    chamaId: string,
    permissionKey: string,
  ): Promise<boolean> {
    // Check system role — OWNER is determined by chama.created_by
    const [chama, memberRole] = await Promise.all([
      this.prisma.chama.findUnique({
        where: { id: chamaId },
        select: { created_by: true },
      }),
      this.prisma.member_role.findUnique({
        where: { user_id_chama_id: { user_id: userId, chama_id: chamaId } },
        include: {
          role: {
            include: {
              role_permissions: {
                include: { permission: true },
              },
            },
          },
        },
      }),
    ]);

    // OWNER always has access
    if (chama && chama.created_by === userId) return true;

    // Check user's system_role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { system_role: true },
    });
    if (
      user?.system_role === system_role.OWNER ||
      user?.system_role === system_role.ADMIN
    ) {
      return true;
    }

    // Check organizational role permissions
    if (!memberRole) return false;

    const hasPermission = memberRole.role.role_permissions.some(
      (rp) => rp.permission.key === permissionKey,
    );
    return hasPermission;
  }

  /**
   * Throws ForbiddenException if user lacks the permission.
   */
  async enforcePermission(
    userId: string,
    chamaId: string,
    permissionKey: string,
  ): Promise<void> {
    const allowed = await this.requirePermission(
      userId,
      chamaId,
      permissionKey,
    );
    if (!allowed) {
      throw new ForbiddenException(
        `You do not have the '${permissionKey}' permission`,
      );
    }
  }

  /**
   * Check if user is OWNER or ADMIN (system-level).
   */
  async isOwnerOrAdmin(userId: string, chamaId: string): Promise<boolean> {
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
      select: { created_by: true },
    });
    if (chama && chama.created_by === userId) return true;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { system_role: true },
    });
    return (
      user?.system_role === system_role.OWNER ||
      user?.system_role === system_role.ADMIN
    );
  }

  // ─── Roles CRUD ──────────────────────────────────────────────────

  /**
   * GET /roles — list all organizational roles for a chama.
   */
  async getRoles(chamaId: string) {
    return this.prisma.role.findMany({
      where: { chama_id: chamaId },
      include: {
        role_permissions: {
          include: { permission: true },
        },
        _count: { select: { member_roles: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * POST /roles — create a custom role.
   */
  async createRole(
    chamaId: string,
    userId: string,
    data: { name: string; description?: string; permissions: string[] },
  ) {
    await this.enforceOwnerOrAdmin(userId, chamaId);

    // Check for duplicate name
    const existing = await this.prisma.role.findUnique({
      where: { chama_id_name: { chama_id: chamaId, name: data.name } },
    });
    if (existing) {
      throw new BadRequestException(
        `A role named '${data.name}' already exists in this chama`,
      );
    }

    // Resolve permission IDs
    const permissions = await this.prisma.permission.findMany({
      where: { key: { in: data.permissions } },
    });

    return this.prisma.role.create({
      data: {
        chama_id: chamaId,
        name: data.name,
        description: data.description,
        is_default: false,
        role_permissions: {
          create: permissions.map((p) => ({ permission_id: p.id })),
        },
      },
      include: {
        role_permissions: { include: { permission: true } },
      },
    });
  }

  /**
   * PUT /roles/:roleId — update role name/description/permissions.
   */
  async updateRole(
    roleId: string,
    chamaId: string,
    userId: string,
    data: { name?: string; description?: string; permissions?: string[] },
  ) {
    await this.enforceOwnerOrAdmin(userId, chamaId);

    const role = await this.prisma.role.findFirst({
      where: { id: roleId, chama_id: chamaId },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Update basic fields
    const updated = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
      },
    });

    // Update permissions if provided
    if (data.permissions !== undefined) {
      const permissions = await this.prisma.permission.findMany({
        where: { key: { in: data.permissions } },
      });

      // Delete existing and recreate
      await this.prisma.role_permission.deleteMany({
        where: { role_id: roleId },
      });
      await this.prisma.role_permission.createMany({
        data: permissions.map((p) => ({
          role_id: roleId,
          permission_id: p.id,
        })),
      });
    }

    // Return updated role with permissions
    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        role_permissions: { include: { permission: true } },
      },
    });
  }

  /**
   * DELETE /roles/:roleId — delete a custom role only.
   */
  async deleteRole(
    roleId: string,
    chamaId: string,
    userId: string,
  ): Promise<void> {
    await this.enforceOwnerOrAdmin(userId, chamaId);

    const role = await this.prisma.role.findFirst({
      where: { id: roleId, chama_id: chamaId },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (role.is_default) {
      throw new BadRequestException('Cannot delete a default role');
    }

    // Move members with this role to "General Member"
    const generalMemberRole = await this.prisma.role.findUnique({
      where: {
        chama_id_name: { chama_id: chamaId, name: 'General Member' },
      },
    });

    if (generalMemberRole) {
      await this.prisma.member_role.updateMany({
        where: { role_id: roleId, chama_id: chamaId },
        data: { role_id: generalMemberRole.id },
      });
    }

    await this.prisma.role.delete({ where: { id: roleId } });
  }

  // ─── Permissions ─────────────────────────────────────────────────

  /**
   * GET /permissions — list all available permissions.
   */
  async getAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: { key: 'asc' },
    });
  }

  // ─── Member Role Assignment ──────────────────────────────────────

  /**
   * PUT /members/:memberId/role — assign/change organizational role.
   */
  async assignMemberRole(
    memberId: string,
    chamaId: string,
    roleId: string,
    currentUserId: string,
  ) {
    await this.enforceOwnerOrAdmin(currentUserId, chamaId);

    // Verify the target user is a member of the chama
    const membership = await this.prisma.membership.findFirst({
      where: { user_id: memberId, chama_id: chamaId },
    });
    if (!membership) {
      throw new NotFoundException(
        'Member not found in this chama',
      );
    }

    // Verify the role belongs to this chama
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, chama_id: chamaId },
    });
    if (!role) {
      throw new NotFoundException('Role not found in this chama');
    }

    return this.prisma.member_role.upsert({
      where: {
        user_id_chama_id: { user_id: memberId, chama_id: chamaId },
      },
      update: { role_id: roleId },
      create: {
        user_id: memberId,
        chama_id: chamaId,
        role_id: roleId,
      },
      include: { role: true },
    });
  }

  // ─── System Role Assignment ──────────────────────────────────────

  /**
   * PUT /system-role/:memberId — assign ADMIN system role (OWNER only).
   */
  async assignSystemRole(
    memberId: string,
    chamaId: string,
    newSystemRole: system_role,
    currentUserId: string,
  ) {
    // Only OWNER can assign system roles
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
      select: { created_by: true },
    });
    if (!chama || chama.created_by !== currentUserId) {
      throw new ForbiddenException(
        'Only the chama owner can assign system roles',
      );
    }

    // Cannot assign OWNER to someone else
    if (newSystemRole === system_role.OWNER) {
      throw new BadRequestException('OWNER role cannot be reassigned');
    }

    // Verify the target is a member
    const membership = await this.prisma.membership.findFirst({
      where: { user_id: memberId, chama_id: chamaId },
    });
    if (!membership) {
      throw new NotFoundException('Member not found in this chama');
    }

    return this.prisma.user.update({
      where: { id: memberId },
      data: { system_role: newSystemRole },
      select: {
        id: true,
        name: true,
        email: true,
        system_role: true,
      },
    });
  }

  // ─── Permissions Matrix ──────────────────────────────────────────

  /**
   * GET /roles/permissions-matrix — return structure for the UI matrix.
   */
  async getPermissionsMatrix(chamaId: string) {
    const [roles, permissions] = await Promise.all([
      this.prisma.role.findMany({
        where: { chama_id: chamaId },
        include: {
          role_permissions: { select: { permission_id: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.permission.findMany({ orderBy: { key: 'asc' } }),
    ]);

    // Build matrix: { [roleId]: { [permissionKey]: boolean } }
    const matrix: Record<string, Record<string, boolean>> = {};
    for (const role of roles) {
      const permIds = new Set(role.role_permissions.map((rp) => rp.permission_id));
      const row: Record<string, boolean> = {};
      for (const perm of permissions) {
        row[perm.key] = permIds.has(perm.id);
      }
      matrix[role.id] = row;
    }

    return {
      roles: roles.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        is_default: r.is_default,
      })),
      permissions: permissions.map((p) => ({
        id: p.id,
        key: p.key,
        description: p.description,
      })),
      matrix,
    };
  }

  // ─── Role Statistics ─────────────────────────────────────────────

  /**
   * GET /roles/stats — count members per organizational role.
   */
  async getRoleStats(chamaId: string) {
    const roles = await this.prisma.role.findMany({
      where: { chama_id: chamaId },
      include: {
        _count: { select: { member_roles: true } },
      },
    });

    const stats: Record<string, number> = {};
    for (const role of roles) {
      // Convert role name to snake_case key
      const key = role.name
        .toLowerCase()
        .replace(/\s+/g, '_');
      stats[key] = role._count.member_roles;
    }

    return stats;
  }

  // ─── Helpers ─────────────────────────────────────────────────────

  private async enforceOwnerOrAdmin(
    userId: string,
    chamaId: string,
  ): Promise<void> {
    const allowed = await this.isOwnerOrAdmin(userId, chamaId);
    if (!allowed) {
      throw new ForbiddenException(
        'Only OWNER or ADMIN can perform this action',
      );
    }
  }
}

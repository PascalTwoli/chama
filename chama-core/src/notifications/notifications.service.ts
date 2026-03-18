import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationAudience } from '@prisma/client';
import {
  GetNotificationsDto,
  NotificationStatus,
} from './dto/get-notifications.dto';
import {
  NotificationResponseDto,
  NotificationStatsDto,
  PaginatedNotificationsDto,
} from './dto/notification-response.dto';

export interface NotifyPayload {
  chamaId: string;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  targetUserIds?: string[]; // Optional: specific users to notify
  permissionKey?: string; // Optional: notify users with this permission
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly repository: NotificationsRepository,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Core notification method - creates notifications based on type and audience
   */
  async notify(typeKey: string, payload: NotifyPayload): Promise<void> {
    try {
      // Find the notification type
      const notificationType = await this.repository.findNotificationType(typeKey);
      if (!notificationType) {
        throw new NotFoundException(`Notification type '${typeKey}' not found`);
      }

      // Determine target users
      let targetUserIds: string[] = [];

      if (payload.targetUserIds && payload.targetUserIds.length > 0) {
        // Use explicitly provided user IDs
        targetUserIds = payload.targetUserIds;
      } else if (payload.permissionKey) {
        // Try to resolve users by permission
        targetUserIds = await this.resolveUsersByPermission(
          payload.chamaId,
          payload.permissionKey
        );
        
        // FALLBACK: If no users found via permission (RBAC not set up), 
        // fall back to default audience
        if (targetUserIds.length === 0) {
          this.logger.warn(
            `No users found with permission '${payload.permissionKey}' in chama ${payload.chamaId}, falling back to default audience`
          );
          targetUserIds = await this.resolveUsersByAudience(
            payload.chamaId,
            notificationType.default_audience
          );
        }
      } else {
        // Resolve users by audience
        targetUserIds = await this.resolveUsersByAudience(
          payload.chamaId,
          notificationType.default_audience
        );
      }

      if (targetUserIds.length === 0) {
        this.logger.warn(
          `No target users found for notification type '${typeKey}' in chama ${payload.chamaId}`
        );
        return;
      }

      // Create notifications for all target users
      const notifications = targetUserIds.map((userId) => ({
        userId,
        chamaId: payload.chamaId,
        typeId: notificationType.id,
        audience: notificationType.default_audience,
        title: payload.title,
        body: payload.body,
        entityType: payload.entityType,
        entityId: payload.entityId,
        actionRequired: notificationType.action_required,
      }));

      await this.repository.createMany(notifications);

      this.logger.log(
        `Created ${notifications.length} notifications of type '${typeKey}' for chama ${payload.chamaId}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to create notifications: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  /**
   * Resolve users by permission key
   */
  private async resolveUsersByPermission(
    chamaId: string,
    permissionKey: string
  ): Promise<string[]> {
    // Find the permission
    const permission = await this.prisma.permission.findUnique({
      where: { key: permissionKey },
    });

    if (!permission) {
      this.logger.warn(`Permission '${permissionKey}' not found`);
      return [];
    }

    // Find all roles in this chama that have this permission
    const rolePermissions = await this.prisma.role_permission.findMany({
      where: {
        permission_id: permission.id,
        role: {
          chama_id: chamaId,
        },
      },
      include: {
        role: true,
      },
    });

    const roleIds = rolePermissions.map((rp) => rp.role_id);

    if (roleIds.length === 0) {
      return [];
    }

    // Find all users with these roles in this chama
    const memberRoles = await this.prisma.member_role.findMany({
      where: {
        chama_id: chamaId,
        role_id: { in: roleIds },
      },
      select: {
        user_id: true,
      },
    });

    return [...new Set(memberRoles.map((mr) => mr.user_id))];
  }

  /**
   * Resolve users by audience type
   */
  private async resolveUsersByAudience(
    chamaId: string,
    audience: NotificationAudience
  ): Promise<string[]> {
    if (audience === NotificationAudience.MEMBER) {
      // All members
      const memberships = await this.prisma.membership.findMany({
        where: { chama_id: chamaId },
        select: { user_id: true },
      });
      return memberships.map((m) => m.user_id);
    } else if (audience === NotificationAudience.ADMIN) {
      // Users with admin permissions (chairperson, treasurer, secretary, etc.)
      // We look for users with ANY admin-level permission
      const adminPermissions = await this.prisma.permission.findMany({
        where: {
          OR: [
            { key: { startsWith: 'chama.' } },
            { key: { startsWith: 'member.' } },
            { key: { startsWith: 'finance.' } },
            { key: { startsWith: 'loan.' } },
          ],
        },
      });

      const permissionIds = adminPermissions.map((p) => p.id);

      const rolePermissions = await this.prisma.role_permission.findMany({
        where: {
          permission_id: { in: permissionIds },
          role: {
            chama_id: chamaId,
          },
        },
        include: {
          role: true,
        },
      });

      const roleIds = [...new Set(rolePermissions.map((rp) => rp.role_id))];

      if (roleIds.length === 0) {
        // FALLBACK: If no RBAC roles found, use legacy user_role from membership
        this.logger.warn(
          `No RBAC roles found for ADMIN audience in chama ${chamaId}, falling back to legacy user_role`
        );
        const adminMemberships = await this.prisma.membership.findMany({
          where: {
            chama_id: chamaId,
            role: {
              in: ['CHAIRPERSON', 'TREASURER', 'SECRETARY'],
            },
          },
          select: { user_id: true },
        });
        return adminMemberships.map((m) => m.user_id);
      }

      const memberRoles = await this.prisma.member_role.findMany({
        where: {
          chama_id: chamaId,
          role_id: { in: roleIds },
        },
        select: {
          user_id: true,
        },
      });

      return [...new Set(memberRoles.map((mr) => mr.user_id))];
    } else if (audience === NotificationAudience.BOTH) {
      // All members
      const memberships = await this.prisma.membership.findMany({
        where: { chama_id: chamaId },
        select: { user_id: true },
      });
      return memberships.map((m) => m.user_id);
    }

    return [];
  }

  /**
   * Get notifications for a user in a chama
   */
  async getNotifications(
    userId: string,
    chamaId: string,
    query: GetNotificationsDto
  ): Promise<PaginatedNotificationsDto> {
    const { notifications, total } = await this.repository.findMany({
      userId,
      chamaId,
      status: query.status,
      audience: query.audience,
      page: query.page || 1,
      limit: query.limit || 20,
    });

    const data = notifications.map((n) => this.mapToResponseDto(n));

    return {
      data,
      total,
      page: query.page || 1,
      limit: query.limit || 20,
      totalPages: Math.ceil(total / (query.limit || 20)),
    };
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(
    id: string,
    userId: string,
    chamaId: string
  ): Promise<NotificationResponseDto> {
    const notification = await this.repository.findById(id, userId, chamaId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.read_at) {
      // Already read, just return it
      return this.mapToResponseDto(notification);
    }

    await this.repository.markAsRead(id, userId, chamaId);

    const updated = await this.repository.findById(id, userId, chamaId);
    if (!updated) {
      throw new NotFoundException('Notification not found after update');
    }

    return this.mapToResponseDto(updated);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string, chamaId: string): Promise<{ count: number }> {
    const result = await this.repository.markAllAsRead(userId, chamaId);
    return { count: result.count };
  }

  /**
   * Get notification statistics
   */
  async getStats(
    userId: string,
    chamaId: string,
    audience?: NotificationAudience
  ): Promise<NotificationStatsDto> {
    return this.repository.getStats(userId, chamaId, audience);
  }

  /**
   * Map database model to response DTO
   */
  private mapToResponseDto(notification: any): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.user_id,
      chamaId: notification.chama_id,
      typeId: notification.type_id,
      audience: notification.audience,
      title: notification.title,
      body: notification.body,
      entityType: notification.entity_type || undefined,
      entityId: notification.entity_id || undefined,
      actionRequired: notification.action_required,
      readAt: notification.read_at || undefined,
      createdAt: notification.createdAt,
    };
  }

  /**
   * Seed notification types (call this on app startup or via migration)
   */
  async seedNotificationTypes(): Promise<void> {
    const types = [
      {
        key: 'contribution.reminder',
        description: 'Reminder to make monthly contribution',
        default_audience: NotificationAudience.MEMBER,
        action_required: true,
      },
      {
        key: 'contribution.received',
        description: 'Contribution received confirmation',
        default_audience: NotificationAudience.MEMBER,
        action_required: false,
      },
      {
        key: 'contribution.late',
        description: 'Late contribution warning',
        default_audience: NotificationAudience.MEMBER,
        action_required: true,
      },
      {
        key: 'loan.request',
        description: 'New loan request submitted',
        default_audience: NotificationAudience.ADMIN,
        action_required: true,
      },
      {
        key: 'loan.approved',
        description: 'Loan request approved',
        default_audience: NotificationAudience.MEMBER,
        action_required: false,
      },
      {
        key: 'loan.rejected',
        description: 'Loan request rejected',
        default_audience: NotificationAudience.MEMBER,
        action_required: false,
      },
      {
        key: 'loan.repayment.due',
        description: 'Loan repayment due reminder',
        default_audience: NotificationAudience.MEMBER,
        action_required: true,
      },
      {
        key: 'meeting.scheduled',
        description: 'New meeting scheduled',
        default_audience: NotificationAudience.BOTH,
        action_required: false,
      },
      {
        key: 'meeting.reminder',
        description: 'Upcoming meeting reminder',
        default_audience: NotificationAudience.BOTH,
        action_required: false,
      },
      {
        key: 'member.joined',
        description: 'New member joined the chama',
        default_audience: NotificationAudience.ADMIN,
        action_required: false,
      },
      {
        key: 'member.left',
        description: 'Member left the chama',
        default_audience: NotificationAudience.ADMIN,
        action_required: false,
      },
      {
        key: 'join_request.new',
        description: 'New join request received',
        default_audience: NotificationAudience.ADMIN,
        action_required: true,
      },
      {
        key: 'join_request.approved',
        description: 'Join request approved',
        default_audience: NotificationAudience.MEMBER,
        action_required: false,
      },
      {
        key: 'join_request.rejected',
        description: 'Join request rejected',
        default_audience: NotificationAudience.MEMBER,
        action_required: false,
      },
      {
        key: 'chama.settings.updated',
        description: 'Chama settings updated',
        default_audience: NotificationAudience.BOTH,
        action_required: false,
      },
      {
        key: 'expense.recorded',
        description: 'New expense recorded',
        default_audience: NotificationAudience.ADMIN,
        action_required: false,
      },
      {
        key: 'report.generated',
        description: 'Financial report generated',
        default_audience: NotificationAudience.ADMIN,
        action_required: false,
      },
    ];

    for (const type of types) {
      await this.repository.createNotificationType(type);
    }

    this.logger.log(`Seeded ${types.length} notification types`);
  }
}

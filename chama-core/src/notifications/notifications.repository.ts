import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationAudience } from '@prisma/client';
import { NotificationStatus } from './dto/get-notifications.dto';

export interface CreateNotificationData {
  userId: string;
  chamaId: string;
  typeId: string;
  audience: NotificationAudience;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  actionRequired: boolean;
}

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a single notification
   */
  async create(data: CreateNotificationData) {
    return this.prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        user_id: data.userId,
        chama_id: data.chamaId,
        type_id: data.typeId,
        audience: data.audience,
        title: data.title,
        body: data.body,
        entity_type: data.entityType,
        entity_id: data.entityId,
        action_required: data.actionRequired,
      },
      include: {
        notification_type: true,
      },
    });
  }

  /**
   * Create multiple notifications in a transaction
   */
  async createMany(notifications: CreateNotificationData[]) {
    return this.prisma.$transaction(
      notifications.map((data) =>
        this.prisma.notification.create({
          data: {
            id: crypto.randomUUID(),
            user_id: data.userId,
            chama_id: data.chamaId,
            type_id: data.typeId,
            audience: data.audience,
            title: data.title,
            body: data.body,
            entity_type: data.entityType,
            entity_id: data.entityId,
            action_required: data.actionRequired,
          },
        })
      )
    );
  }

  /**
   * Find notifications with filters and pagination
   */
  async findMany(params: {
    userId: string;
    chamaId: string;
    status?: NotificationStatus;
    audience?: NotificationAudience;
    page: number;
    limit: number;
  }) {
    const { userId, chamaId, status, audience, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      user_id: userId,
      chama_id: chamaId,
    };

    // Filter by status
    if (status === NotificationStatus.UNREAD) {
      where.read_at = null;
    } else if (status === NotificationStatus.ACTION) {
      where.action_required = true;
      where.read_at = null;
    }

    // Filter by audience - include 'BOTH' for any audience filter
    if (audience) {
      where.audience = {
        in: [audience, NotificationAudience.BOTH],
      };
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          notification_type: true,
        },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  /**
   * Find a single notification by ID
   */
  async findById(id: string, userId: string, chamaId: string) {
    return this.prisma.notification.findFirst({
      where: {
        id,
        user_id: userId,
        chama_id: chamaId,
      },
      include: {
        notification_type: true,
      },
    });
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string, userId: string, chamaId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id,
        user_id: userId,
        chama_id: chamaId,
        read_at: null,
      },
      data: {
        read_at: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user in a chama
   */
  async markAllAsRead(userId: string, chamaId: string) {
    return this.prisma.notification.updateMany({
      where: {
        user_id: userId,
        chama_id: chamaId,
        read_at: null,
      },
      data: {
        read_at: new Date(),
      },
    });
  }

  /**
   * Get notification statistics
   */
  async getStats(userId: string, chamaId: string, audience?: NotificationAudience) {
    const where: any = {
      user_id: userId,
      chama_id: chamaId,
    };

    if (audience) {
      // Include notifications for the specified audience AND 'BOTH'
      where.audience = {
        in: [audience, NotificationAudience.BOTH],
      };
    }

    const [total, unread, actionRequired] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { ...where, read_at: null },
      }),
      this.prisma.notification.count({
        where: { ...where, action_required: true, read_at: null },
      }),
    ]);

    return { total, unread, actionRequired };
  }

  /**
   * Find notification type by key
   */
  async findNotificationType(key: string) {
    return this.prisma.notification_type.findUnique({
      where: { key },
    });
  }

  /**
   * Create notification type (for seeding)
   */
  async createNotificationType(data: {
    key: string;
    description?: string;
    default_audience: NotificationAudience;
    action_required: boolean;
  }) {
    return this.prisma.notification_type.upsert({
      where: { key: data.key },
      update: {
        description: data.description,
        default_audience: data.default_audience,
        action_required: data.action_required,
      },
      create: {
        id: crypto.randomUUID(),
        key: data.key,
        description: data.description,
        default_audience: data.default_audience,
        action_required: data.action_required,
      },
    });
  }
}

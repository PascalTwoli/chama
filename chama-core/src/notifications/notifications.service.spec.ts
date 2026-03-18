import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { NotificationAudience } from '@prisma/client';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: NotificationsRepository;
  let prisma: PrismaService;

  const mockNotificationType = {
    id: 'type-uuid',
    key: 'test.notification',
    description: 'Test notification',
    default_audience: NotificationAudience.MEMBER,
    action_required: false,
    createdAt: new Date(),
  };

  const mockMemberships = [
    { user_id: 'user-1' },
    { user_id: 'user-2' },
    { user_id: 'user-3' },
  ];

  const mockPermission = {
    id: 'permission-uuid',
    key: 'test.permission',
    description: 'Test permission',
  };

  const mockRolePermissions = [
    {
      role_id: 'role-1',
      permission_id: 'permission-uuid',
      role: { id: 'role-1', chama_id: 'chama-uuid', name: 'Test Role' },
    },
  ];

  const mockMemberRoles = [
    { user_id: 'user-1', chama_id: 'chama-uuid', role_id: 'role-1' },
    { user_id: 'user-2', chama_id: 'chama-uuid', role_id: 'role-1' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationsRepository,
          useValue: {
            findNotificationType: jest.fn(),
            createMany: jest.fn(),
            findMany: jest.fn(),
            findById: jest.fn(),
            markAsRead: jest.fn(),
            markAllAsRead: jest.fn(),
            getStats: jest.fn(),
            createNotificationType: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            permission: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
            role_permission: {
              findMany: jest.fn(),
            },
            member_role: {
              findMany: jest.fn(),
            },
            membership: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    repository = module.get<NotificationsRepository>(NotificationsRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('notify', () => {
    it('should throw NotFoundException if notification type not found', async () => {
      jest.spyOn(repository, 'findNotificationType').mockResolvedValue(null);

      await expect(
        service.notify('nonexistent.type', {
          chamaId: 'chama-uuid',
          title: 'Test',
          body: 'Test body',
        })
      ).rejects.toThrow(NotFoundException);
    });

    it('should create notifications for all members when no targeting specified', async () => {
      jest.spyOn(repository, 'findNotificationType').mockResolvedValue(mockNotificationType);
      jest.spyOn(prisma.membership, 'findMany').mockResolvedValue(mockMemberships as any);
      jest.spyOn(repository, 'createMany').mockResolvedValue([]);

      await service.notify('test.notification', {
        chamaId: 'chama-uuid',
        title: 'Test Notification',
        body: 'Test body',
      });

      expect(repository.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            userId: 'user-1',
            chamaId: 'chama-uuid',
            title: 'Test Notification',
            body: 'Test body',
          }),
          expect.objectContaining({
            userId: 'user-2',
          }),
          expect.objectContaining({
            userId: 'user-3',
          }),
        ])
      );
    });

    it('should create notifications for specific users when targetUserIds provided', async () => {
      jest.spyOn(repository, 'findNotificationType').mockResolvedValue(mockNotificationType);
      jest.spyOn(repository, 'createMany').mockResolvedValue([]);

      await service.notify('test.notification', {
        chamaId: 'chama-uuid',
        title: 'Test Notification',
        body: 'Test body',
        targetUserIds: ['user-1', 'user-2'],
      });

      expect(repository.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ userId: 'user-1' }),
          expect.objectContaining({ userId: 'user-2' }),
        ])
      );
      expect(repository.createMany).toHaveBeenCalledWith(
        expect.not.arrayContaining([
          expect.objectContaining({ userId: 'user-3' }),
        ])
      );
    });

    it('should resolve users by permission when permissionKey provided', async () => {
      jest.spyOn(repository, 'findNotificationType').mockResolvedValue(mockNotificationType);
      jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(mockPermission as any);
      jest.spyOn(prisma.role_permission, 'findMany').mockResolvedValue(mockRolePermissions as any);
      jest.spyOn(prisma.member_role, 'findMany').mockResolvedValue(mockMemberRoles as any);
      jest.spyOn(repository, 'createMany').mockResolvedValue([]);

      await service.notify('test.notification', {
        chamaId: 'chama-uuid',
        title: 'Test Notification',
        body: 'Test body',
        permissionKey: 'test.permission',
      });

      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: { key: 'test.permission' },
      });
      expect(repository.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ userId: 'user-1' }),
          expect.objectContaining({ userId: 'user-2' }),
        ])
      );
    });

    it('should include entity information when provided', async () => {
      jest.spyOn(repository, 'findNotificationType').mockResolvedValue(mockNotificationType);
      jest.spyOn(repository, 'createMany').mockResolvedValue([]);

      await service.notify('test.notification', {
        chamaId: 'chama-uuid',
        title: 'Test Notification',
        body: 'Test body',
        entityType: 'loan',
        entityId: 'loan-uuid',
        targetUserIds: ['user-1'],
      });

      expect(repository.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            entityType: 'loan',
            entityId: 'loan-uuid',
          }),
        ])
      );
    });

    it('should not create notifications if no target users found', async () => {
      jest.spyOn(repository, 'findNotificationType').mockResolvedValue(mockNotificationType);
      jest.spyOn(prisma.membership, 'findMany').mockResolvedValue([]);
      jest.spyOn(repository, 'createMany').mockResolvedValue([]);

      await service.notify('test.notification', {
        chamaId: 'chama-uuid',
        title: 'Test Notification',
        body: 'Test body',
      });

      expect(repository.createMany).not.toHaveBeenCalled();
    });
  });

  describe('getNotifications', () => {
    it('should return paginated notifications', async () => {
      const mockNotifications = [
        {
          id: 'notif-1',
          user_id: 'user-1',
          chama_id: 'chama-uuid',
          type_id: 'type-uuid',
          audience: NotificationAudience.MEMBER,
          title: 'Test 1',
          body: 'Body 1',
          action_required: false,
          read_at: null,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(repository, 'findMany').mockResolvedValue({
        notifications: mockNotifications as any,
        total: 1,
      });

      const result = await service.getNotifications('user-1', 'chama-uuid', {
        page: 1,
        limit: 20,
      });

      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 'notif-1',
            title: 'Test 1',
          }),
        ]),
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const mockNotification = {
        id: 'notif-1',
        user_id: 'user-1',
        chama_id: 'chama-uuid',
        type_id: 'type-uuid',
        audience: NotificationAudience.MEMBER,
        title: 'Test',
        body: 'Body',
        action_required: false,
        read_at: null,
        createdAt: new Date(),
      };

      const mockUpdatedNotification = {
        ...mockNotification,
        read_at: new Date(),
      };

      jest.spyOn(repository, 'findById')
        .mockResolvedValueOnce(mockNotification as any)
        .mockResolvedValueOnce(mockUpdatedNotification as any);
      jest.spyOn(repository, 'markAsRead').mockResolvedValue({ count: 1 } as any);

      const result = await service.markAsRead('notif-1', 'user-1', 'chama-uuid');

      expect(repository.markAsRead).toHaveBeenCalledWith('notif-1', 'user-1', 'chama-uuid');
      expect(result.readAt).toBeDefined();
    });

    it('should throw NotFoundException if notification not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(
        service.markAsRead('nonexistent', 'user-1', 'chama-uuid')
      ).rejects.toThrow(NotFoundException);
    });

    it('should return notification if already read', async () => {
      const mockNotification = {
        id: 'notif-1',
        user_id: 'user-1',
        chama_id: 'chama-uuid',
        type_id: 'type-uuid',
        audience: NotificationAudience.MEMBER,
        title: 'Test',
        body: 'Body',
        action_required: false,
        read_at: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(mockNotification as any);

      const result = await service.markAsRead('notif-1', 'user-1', 'chama-uuid');

      expect(repository.markAsRead).not.toHaveBeenCalled();
      expect(result.readAt).toBeDefined();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      jest.spyOn(repository, 'markAllAsRead').mockResolvedValue({ count: 5 } as any);

      const result = await service.markAllAsRead('user-1', 'chama-uuid');

      expect(repository.markAllAsRead).toHaveBeenCalledWith('user-1', 'chama-uuid');
      expect(result.count).toBe(5);
    });
  });

  describe('getStats', () => {
    it('should return notification statistics', async () => {
      const mockStats = {
        total: 10,
        unread: 5,
        actionRequired: 2,
      };

      jest.spyOn(repository, 'getStats').mockResolvedValue(mockStats);

      const result = await service.getStats('user-1', 'chama-uuid');

      expect(result).toEqual(mockStats);
      expect(repository.getStats).toHaveBeenCalledWith('user-1', 'chama-uuid', undefined);
    });

    it('should filter by audience when provided', async () => {
      const mockStats = {
        total: 5,
        unread: 2,
        actionRequired: 1,
      };

      jest.spyOn(repository, 'getStats').mockResolvedValue(mockStats);

      const result = await service.getStats('user-1', 'chama-uuid', NotificationAudience.ADMIN);

      expect(repository.getStats).toHaveBeenCalledWith(
        'user-1',
        'chama-uuid',
        NotificationAudience.ADMIN
      );
    });
  });

  describe('seedNotificationTypes', () => {
    it('should seed all notification types', async () => {
      jest.spyOn(repository, 'createNotificationType').mockResolvedValue(mockNotificationType as any);

      await service.seedNotificationTypes();

      expect(repository.createNotificationType).toHaveBeenCalledTimes(17); // 17 predefined types
    });
  });
});

# Notifications Module - Migration Guide

This guide will help you integrate the new notifications module into your existing ChamaPlus application.

## Prerequisites

- NestJS application running
- Prisma ORM configured
- PostgreSQL database
- Existing RBAC system (roles, permissions, member_roles)

## Step-by-Step Migration

### Step 1: Update Prisma Schema

The Prisma schema has already been updated with:
- `notification_type` model
- `notification` model
- `NotificationAudience` enum

### Step 2: Create and Run Migration

```bash
cd chama-core

# Generate migration
npx prisma migrate dev --name add_notifications_module

# This will:
# 1. Create the notification_type table
# 2. Create the notification table
# 3. Add indexes for performance
# 4. Create the NotificationAudience enum
```

### Step 3: Seed Notification Types

```bash
# Run the seed script
npx ts-node prisma/seed-notification-types.ts
```

Or add to your existing seed script:
```typescript
// prisma/seed.ts
import { NotificationsService } from '../src/notifications/notifications.service';

async function main() {
  // ... existing seeds ...

  // Seed notification types
  const notificationsService = new NotificationsService(
    new NotificationsRepository(prisma),
    prisma
  );
  await notificationsService.seedNotificationTypes();
}
```

### Step 4: Import Module in App Module

```typescript
// src/app.module.ts
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // ... existing modules
    PrismaModule,
    AuthModule,
    ChamaModule,
    NotificationsModule, // ← Add this
  ],
})
export class AppModule {}
```

### Step 5: Update Existing Services

#### Example: Join Requests Service

```typescript
// src/join-requests/join-requests.service.ts
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class JoinRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService, // ← Add this
  ) {}

  async approveJoinRequest(requestId: string, reviewerId: string) {
    const request = await this.prisma.join_request.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        reviewed_by: reviewerId,
        reviewed_at: new Date(),
      },
      include: { user: true },
    });

    // ← Add notification
    await this.notificationsService.notify('join_request.approved', {
      chamaId: request.chama_id,
      title: 'Join Request Approved',
      body: 'Your request to join has been approved. Welcome!',
      entityType: 'join_request',
      entityId: request.id,
      targetUserIds: [request.user_id],
    });

    // ← Notify admins
    await this.notificationsService.notify('member.joined', {
      chamaId: request.chama_id,
      title: 'New Member Joined',
      body: `${request.user.name} has joined the chama`,
      entityType: 'member',
      entityId: request.user_id,
    });

    return request;
  }
}
```

Don't forget to add `NotificationsModule` to the imports of `JoinRequestsModule`:

```typescript
// src/join-requests/join-requests.module.ts
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule, // ← Add this
  ],
  controllers: [JoinRequestsController],
  providers: [JoinRequestsService],
})
export class JoinRequestsModule {}
```

### Step 6: Add Notification Endpoints to Frontend

Update your API client to include notification endpoints:

```typescript
// frontend/src/services/notifications-service.ts
import axios from 'axios';

export interface Notification {
  id: string;
  title: string;
  body: string;
  actionRequired: boolean;
  readAt?: string;
  createdAt: string;
  entityType?: string;
  entityId?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  actionRequired: number;
}

class NotificationsService {
  async getNotifications(chamaId: string, params?: {
    page?: number;
    limit?: number;
    status?: 'all' | 'unread' | 'action';
    audience?: 'ADMIN' | 'MEMBER';
  }) {
    const response = await axios.get('/notifications', {
      params: { chamaId, ...params },
    });
    return response.data;
  }

  async getStats(chamaId: string, audience?: 'ADMIN' | 'MEMBER') {
    const response = await axios.get('/notifications/stats', {
      params: { chamaId, audience },
    });
    return response.data;
  }

  async markAsRead(id: string, chamaId: string) {
    const response = await axios.put(`/notifications/${id}/read`, null, {
      params: { chamaId },
    });
    return response.data;
  }

  async markAllAsRead(chamaId: string) {
    const response = await axios.put('/notifications/read-all', null, {
      params: { chamaId },
    });
    return response.data;
  }
}

export default new NotificationsService();
```

### Step 7: Test the Integration

```bash
# Start the backend
npm run start:dev

# Test endpoints with curl or Postman
curl -X GET "http://localhost:5500/api/v1/notifications?chamaId=YOUR_CHAMA_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X GET "http://localhost:5500/api/v1/notifications/stats?chamaId=YOUR_CHAMA_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Integration Patterns

### Pattern 1: Notify on Entity Creation

```typescript
async createEntity(data: CreateDto) {
  const entity = await this.prisma.entity.create({ data });

  await this.notificationsService.notify('entity.created', {
    chamaId: data.chamaId,
    title: 'New Entity Created',
    body: `Entity ${entity.name} has been created`,
    entityType: 'entity',
    entityId: entity.id,
    permissionKey: 'entity.view', // Notify users with this permission
  });

  return entity;
}
```

### Pattern 2: Notify on Status Change

```typescript
async updateStatus(id: string, newStatus: string) {
  const entity = await this.prisma.entity.update({
    where: { id },
    data: { status: newStatus },
  });

  await this.notificationsService.notify('entity.status.changed', {
    chamaId: entity.chamaId,
    title: 'Status Updated',
    body: `Status changed to ${newStatus}`,
    entityType: 'entity',
    entityId: entity.id,
    targetUserIds: [entity.userId], // Notify specific user
  });

  return entity;
}
```

### Pattern 3: Scheduled Notifications (Cron Jobs)

```typescript
// src/notifications/notifications.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsScheduler {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyReminders() {
    // Get chamas with contributions due
    const chamas = await this.getChamsWithDueContributions();

    for (const chama of chamas) {
      const unpaidMembers = await this.getUnpaidMembers(chama.id);

      if (unpaidMembers.length > 0) {
        await this.notificationsService.notify('contribution.reminder', {
          chamaId: chama.id,
          title: 'Contribution Reminder',
          body: `Your contribution of KSh ${chama.amount} is due soon`,
          targetUserIds: unpaidMembers.map(m => m.userId),
        });
      }
    }
  }
}
```

## Rollback Plan

If you need to rollback the migration:

```bash
# Rollback the migration
npx prisma migrate resolve --rolled-back add_notifications_module

# Or manually drop tables
psql -d your_database -c "DROP TABLE IF EXISTS notification CASCADE;"
psql -d your_database -c "DROP TABLE IF EXISTS notification_type CASCADE;"
psql -d your_database -c "DROP TYPE IF EXISTS NotificationAudience CASCADE;"
```

## Troubleshooting

### Issue: "Notification type not found"

**Solution**: Run the seed script to populate notification types:
```bash
npx ts-node prisma/seed-notification-types.ts
```

### Issue: "No users found for notification"

**Possible causes**:
1. Permission key doesn't exist
2. No users have the required permission
3. No users in the chama

**Debug**:
```typescript
// Check if permission exists
const permission = await prisma.permission.findUnique({
  where: { key: 'your.permission' }
});
console.log('Permission:', permission);

// Check role permissions
const rolePerms = await prisma.role_permission.findMany({
  where: { permission_id: permission.id },
  include: { role: true },
});
console.log('Role Permissions:', rolePerms);
```

### Issue: "Notifications not showing in frontend"

**Checklist**:
1. ✅ User is authenticated
2. ✅ `chamaId` is provided in query params
3. ✅ User is a member of the chama
4. ✅ Notifications exist in database

**Debug query**:
```sql
SELECT * FROM notification 
WHERE user_id = 'YOUR_USER_ID' 
AND chama_id = 'YOUR_CHAMA_ID'
ORDER BY "createdAt" DESC;
```

## Performance Optimization

### Add Database Indexes (Already included in schema)

```prisma
@@index([user_id, chama_id])
@@index([read_at])
@@index([user_id, chama_id, read_at])
```

### Cache Notification Counts

```typescript
// Use Redis or in-memory cache
@Injectable()
export class NotificationsCacheService {
  constructor(
    private readonly cacheManager: Cache,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getStats(userId: string, chamaId: string) {
    const cacheKey = `notifications:stats:${userId}:${chamaId}`;
    
    let stats = await this.cacheManager.get(cacheKey);
    if (!stats) {
      stats = await this.notificationsService.getStats(userId, chamaId);
      await this.cacheManager.set(cacheKey, stats, 300); // 5 minutes
    }
    
    return stats;
  }
}
```

## Next Steps

1. ✅ Run migration
2. ✅ Seed notification types
3. ✅ Import module
4. ✅ Update existing services
5. ✅ Add frontend integration
6. ✅ Test thoroughly
7. 🔄 Monitor logs for issues
8. 🔄 Set up scheduled jobs (optional)
9. 🔄 Add WebSocket support (future)
10. 🔄 Add email/SMS support (future)

## Support

For issues or questions:
1. Check the README.md
2. Review integration examples
3. Check application logs
4. Verify database state

## Changelog

### v1.0.0 (Initial Release)
- ✅ Core notification system
- ✅ Permission-based targeting
- ✅ Multi-tenant support
- ✅ REST API endpoints
- ✅ 17 pre-defined notification types
- ✅ Action-required notifications
- ✅ Entity linking
- ✅ Read/unread tracking
- ✅ Statistics endpoint

### Future Versions
- 🔄 WebSocket real-time notifications
- 🔄 Email notifications
- 🔄 SMS notifications
- 🔄 Push notifications (mobile)
- 🔄 Notification preferences
- 🔄 Digest emails (daily/weekly)

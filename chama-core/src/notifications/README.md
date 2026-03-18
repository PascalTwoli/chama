# Notifications Module

Production-grade notifications system for ChamaPlus multi-tenant chama management platform.

## Features

- ✅ Multi-tenant support (scoped by userId + chamaId)
- ✅ RBAC integration (permission-based targeting)
- ✅ Flexible audience targeting (ADMIN, MEMBER, BOTH)
- ✅ Action-required notifications
- ✅ Entity linking (loan, payment, meeting, etc.)
- ✅ Pagination and filtering
- ✅ Read/unread tracking
- ✅ Statistics endpoint
- ✅ Future-ready for WebSocket, Email, SMS

## Architecture

```
notifications/
├── dto/
│   ├── get-notifications.dto.ts      # Query parameters
│   ├── mark-read.dto.ts               # Mark as read DTO
│   └── notification-response.dto.ts   # Response DTOs
├── notifications.controller.ts        # REST API endpoints
├── notifications.service.ts           # Business logic
├── notifications.repository.ts        # Data access layer
├── notifications.module.ts            # NestJS module
└── README.md                          # This file
```

## Database Schema

### notification_type
```prisma
model notification_type {
  id               String               @id @default(uuid())
  key              String               @unique
  description      String?
  default_audience NotificationAudience @default(MEMBER)
  action_required  Boolean              @default(false)
  createdAt        DateTime             @default(now())
  notification     notification[]
}
```

### notification
```prisma
model notification {
  id             String               @id @default(uuid())
  user_id        String
  chama_id       String
  type_id        String
  audience       NotificationAudience
  title          String
  body           String
  entity_type    String?
  entity_id      String?
  action_required Boolean             @default(false)
  read_at        DateTime?
  createdAt      DateTime            @default(now())
  
  @@index([user_id, chama_id])
  @@index([read_at])
  @@index([user_id, chama_id, read_at])
}
```

## API Endpoints

### GET /notifications
Get paginated notifications for the authenticated user in a chama.

**Query Parameters:**
- `chamaId` (required): Chama ID
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `status` (optional): `all` | `unread` | `action`
- `audience` (optional): `ADMIN` | `MEMBER`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "chamaId": "uuid",
      "typeId": "uuid",
      "audience": "MEMBER",
      "title": "Contribution Reminder",
      "body": "Your monthly contribution of KSh 5,000 is due",
      "entityType": "contribution",
      "entityId": "uuid",
      "actionRequired": true,
      "readAt": null,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### GET /notifications/stats
Get notification statistics.

**Query Parameters:**
- `chamaId` (required): Chama ID
- `audience` (optional): `ADMIN` | `MEMBER`

**Response:**
```json
{
  "total": 45,
  "unread": 12,
  "actionRequired": 3
}
```

### PUT /notifications/:id/read
Mark a notification as read.

**Query Parameters:**
- `chamaId` (required): Chama ID

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "chamaId": "uuid",
  "title": "Contribution Reminder",
  "readAt": "2026-01-15T10:30:00Z",
  ...
}
```

### PUT /notifications/read-all
Mark all notifications as read for the user in a chama.

**Query Parameters:**
- `chamaId` (required): Chama ID

**Response:**
```json
{
  "count": 12
}
```

## Usage Examples

### Creating Notifications

#### Example 1: Notify by Permission
```typescript
// Notify all users with loan.review permission
await notificationsService.notify('loan.request', {
  chamaId: 'chama-uuid',
  title: 'New Loan Request',
  body: 'John Doe has requested a loan of KSh 50,000',
  entityType: 'loan',
  entityId: 'loan-uuid',
  permissionKey: 'loan.review',
});
```

#### Example 2: Notify Specific Users
```typescript
// Notify specific users
await notificationsService.notify('contribution.received', {
  chamaId: 'chama-uuid',
  title: 'Contribution Received',
  body: 'Your contribution of KSh 5,000 has been received',
  entityType: 'contribution',
  entityId: 'contribution-uuid',
  targetUserIds: ['user-uuid-1', 'user-uuid-2'],
});
```

#### Example 3: Notify by Audience
```typescript
// Notify all admins (uses default_audience from notification_type)
await notificationsService.notify('member.joined', {
  chamaId: 'chama-uuid',
  title: 'New Member',
  body: 'Jane Smith has joined the chama',
  entityType: 'member',
  entityId: 'user-uuid',
});
```

### Integration Example: Join Request Approval

```typescript
// In join-requests.service.ts
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class JoinRequestsService {
  constructor(
    private readonly notificationsService: NotificationsService,
    // ... other dependencies
  ) {}

  async approveJoinRequest(requestId: string, reviewerId: string) {
    // Approve the request
    const request = await this.prisma.join_request.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        reviewed_by: reviewerId,
        reviewed_at: new Date(),
      },
      include: { user: true },
    });

    // Notify the user
    await this.notificationsService.notify('join_request.approved', {
      chamaId: request.chama_id,
      title: 'Join Request Approved',
      body: `Your request to join has been approved. Welcome!`,
      entityType: 'join_request',
      entityId: request.id,
      targetUserIds: [request.user_id],
    });

    // Notify admins
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

## Notification Types

Pre-seeded notification types:

| Key | Audience | Action Required | Description |
|-----|----------|-----------------|-------------|
| `contribution.reminder` | MEMBER | ✅ | Reminder to make monthly contribution |
| `contribution.received` | MEMBER | ❌ | Contribution received confirmation |
| `contribution.late` | MEMBER | ✅ | Late contribution warning |
| `loan.request` | ADMIN | ✅ | New loan request submitted |
| `loan.approved` | MEMBER | ❌ | Loan request approved |
| `loan.rejected` | MEMBER | ❌ | Loan request rejected |
| `loan.repayment.due` | MEMBER | ✅ | Loan repayment due reminder |
| `meeting.scheduled` | BOTH | ❌ | New meeting scheduled |
| `meeting.reminder` | BOTH | ❌ | Upcoming meeting reminder |
| `member.joined` | ADMIN | ❌ | New member joined the chama |
| `member.left` | ADMIN | ❌ | Member left the chama |
| `join_request.new` | ADMIN | ✅ | New join request received |
| `join_request.approved` | MEMBER | ❌ | Join request approved |
| `join_request.rejected` | MEMBER | ❌ | Join request rejected |
| `chama.settings.updated` | BOTH | ❌ | Chama settings updated |
| `expense.recorded` | ADMIN | ❌ | New expense recorded |
| `report.generated` | ADMIN | ❌ | Financial report generated |

## Setup Instructions

### 1. Run Prisma Migration
```bash
cd chama-core
npx prisma migrate dev --name add_notifications_module
```

### 2. Seed Notification Types
```bash
npx ts-node prisma/seed-notification-types.ts
```

Or programmatically:
```typescript
// In app.module.ts or main.ts
const notificationsService = app.get(NotificationsService);
await notificationsService.seedNotificationTypes();
```

### 3. Import Module
```typescript
// In app.module.ts
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // ... other modules
    NotificationsModule,
  ],
})
export class AppModule {}
```

## Permission-Based Targeting

The system resolves users by permissions, not hardcoded roles:

```typescript
// ❌ BAD: Hardcoded roles
const treasurers = await findUsersByRole('TREASURER');

// ✅ GOOD: Permission-based
await notificationsService.notify('loan.request', {
  chamaId: 'uuid',
  title: 'New Loan Request',
  body: 'Review required',
  permissionKey: 'loan.review', // Resolves all users with this permission
});
```

## Future Enhancements

### WebSocket Real-Time Notifications
```typescript
// notifications.gateway.ts (future)
@WebSocketGateway()
export class NotificationsGateway {
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, chamaId: string) {
    client.join(`chama:${chamaId}`);
  }

  notifyRealtime(chamaId: string, notification: any) {
    this.server.to(`chama:${chamaId}`).emit('notification', notification);
  }
}
```

### Email Notifications
```typescript
// notifications.email.service.ts (future)
async sendEmail(notification: Notification) {
  await this.mailer.send({
    to: notification.user.email,
    subject: notification.title,
    body: notification.body,
  });
}
```

### SMS Notifications
```typescript
// notifications.sms.service.ts (future)
async sendSMS(notification: Notification) {
  await this.smsProvider.send({
    to: notification.user.phone,
    message: `${notification.title}: ${notification.body}`,
  });
}
```

## Testing

```typescript
// notifications.service.spec.ts
describe('NotificationsService', () => {
  it('should create notifications for users with permission', async () => {
    await service.notify('loan.request', {
      chamaId: 'test-chama',
      title: 'Test',
      body: 'Test body',
      permissionKey: 'loan.review',
    });

    // Assert notifications created
  });
});
```

## Performance Considerations

- **Indexes**: Composite indexes on `(user_id, chama_id)` and `(user_id, chama_id, read_at)` for fast queries
- **Batch Creation**: Uses `createMany` with transactions for bulk inserts
- **Pagination**: All list endpoints support pagination
- **Caching**: Consider caching notification counts for high-traffic chamas

## Security

- All endpoints require authentication (`@CurrentUser()` decorator)
- Notifications are scoped to `userId` + `chamaId`
- Users can only access their own notifications
- Permission-based targeting prevents unauthorized access

## Monitoring

Log important events:
```typescript
this.logger.log(`Created ${count} notifications for chama ${chamaId}`);
this.logger.warn(`No users found with permission ${permissionKey}`);
this.logger.error(`Failed to create notifications: ${error.message}`);
```

## License

MIT

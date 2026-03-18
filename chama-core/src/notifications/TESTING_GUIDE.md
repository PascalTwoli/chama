# Notifications Integration - Testing Guide

## Prerequisites

1. Backend running: `pnpm run backend`
2. Database migrated: `npx prisma migrate dev`
3. Notification types seeded: `npx ts-node prisma/seed-notification-types.ts`
4. User authenticated with valid JWT token

## API Endpoints

Base URL: `http://localhost:5500/api/v1`

### Notifications Endpoints

1. **GET /notifications** - Get paginated notifications
2. **GET /notifications/stats** - Get notification statistics
3. **PUT /notifications/:id/read** - Mark notification as read
4. **PUT /notifications/read-all** - Mark all as read

## Test Scenarios

### Scenario 1: Join Request Flow

#### Step 1: Create a Join Request
```bash
curl -X POST http://localhost:5500/api/v1/chamas/{chamaId}/requests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I would like to join this chama"
  }'
```

**Expected Notifications:**
- Admins with `member.approve` permission receive:
  - Type: `join_request.new`
  - Title: "New Join Request"
  - Body: "{User Name} wants to join {Chama Name}"
  - Action Required: Yes

#### Step 2: Check Admin Notifications
```bash
curl -X GET "http://localhost:5500/api/v1/notifications?chamaId={chamaId}&audience=ADMIN&status=unread" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "New Join Request",
      "body": "John Doe wants to join Savings Chama",
      "actionRequired": true,
      "readAt": null,
      "entityType": "join_request",
      "entityId": "request-uuid",
      "createdAt": "2026-03-13T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

#### Step 3: Approve the Join Request
```bash
curl -X POST http://localhost:5500/api/v1/chamas/{chamaId}/requests/{requestId}/review \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "APPROVED"
  }'
```

**Expected Notifications:**
1. Applicant receives:
   - Type: `join_request.approved`
   - Title: "Join Request Approved"
   - Body: "Your request to join {Chama Name} has been approved. Welcome!"
   - Action Required: No

2. Admins with `member.view` permission receive:
   - Type: `member.joined`
   - Title: "New Member Joined"
   - Body: "{User Name} has joined the chama"
   - Action Required: No

#### Step 4: Check Applicant Notifications
```bash
curl -X GET "http://localhost:5500/api/v1/notifications?chamaId={chamaId}&status=unread" \
  -H "Authorization: Bearer APPLICANT_TOKEN"
```

---

### Scenario 2: Contribution Payment

#### Step 1: Record a Contribution
```bash
curl -X POST http://localhost:5500/api/v1/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CONTRIBUTION",
    "amount": 5000,
    "chamaId": "{chamaId}",
    "description": "Monthly contribution"
  }'
```

**Expected Notifications:**
1. Contributor receives:
   - Type: `contribution.received`
   - Title: "Contribution Received"
   - Body: "Your contribution of KSh 5,000 has been received. Thank you!"
   - Action Required: No

2. Admins with `finance.view` permission receive:
   - Type: `contribution.received`
   - Title: "Contribution Recorded"
   - Body: "{User Name} contributed KSh 5,000"
   - Action Required: No

#### Step 2: Check Notifications
```bash
# Check contributor's notification
curl -X GET "http://localhost:5500/api/v1/notifications?chamaId={chamaId}&status=unread" \
  -H "Authorization: Bearer CONTRIBUTOR_TOKEN"

# Check admin notifications
curl -X GET "http://localhost:5500/api/v1/notifications?chamaId={chamaId}&audience=ADMIN" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Scenario 3: Settings Update

#### Step 1: Update Chama Settings
```bash
curl -X PUT http://localhost:5500/api/v1/chamas/{chamaId}/settings \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contributionAmount": 10000,
    "gracePeriodDays": 5,
    "latePaymentFee": 500
  }'
```

**Expected Notifications:**
- All members (BOTH audience) receive:
  - Type: `chama.settings.updated`
  - Title: "Chama Settings Updated"
  - Body: "The following settings have been updated: contribution amount, grace period, late payment fee"
  - Action Required: No

#### Step 2: Check All Members' Notifications
```bash
curl -X GET "http://localhost:5500/api/v1/notifications?chamaId={chamaId}&status=unread" \
  -H "Authorization: Bearer ANY_MEMBER_TOKEN"
```

---

### Scenario 4: Notification Statistics

#### Get Notification Stats
```bash
curl -X GET "http://localhost:5500/api/v1/notifications/stats?chamaId={chamaId}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "total": 15,
  "unread": 5,
  "actionRequired": 2
}
```

#### Get Admin-Only Stats
```bash
curl -X GET "http://localhost:5500/api/v1/notifications/stats?chamaId={chamaId}&audience=ADMIN" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Scenario 5: Mark Notifications as Read

#### Mark Single Notification as Read
```bash
curl -X PUT "http://localhost:5500/api/v1/notifications/{notificationId}/read?chamaId={chamaId}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "id": "uuid",
  "title": "New Join Request",
  "readAt": "2026-03-13T00:10:00Z",
  ...
}
```

#### Mark All Notifications as Read
```bash
curl -X PUT "http://localhost:5500/api/v1/notifications/read-all?chamaId={chamaId}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "count": 5
}
```

---

## Testing with Swagger

1. Open Swagger UI: `http://localhost:5500/api/docs`
2. Click "Authorize" and enter your JWT token
3. Navigate to "Notifications" section
4. Test each endpoint interactively

---

## Verification Checklist

### Join Request Flow
- [ ] New join request creates notification for admins
- [ ] Notification has `actionRequired: true`
- [ ] Notification targets users with `member.approve` permission
- [ ] Approved request notifies applicant
- [ ] Approved request notifies admins about new member
- [ ] Rejected request notifies applicant

### Contribution Payment
- [ ] Contribution creates notification for contributor
- [ ] Contribution creates notification for finance admins
- [ ] Notifications have correct amount formatting
- [ ] Notifications link to transaction entity

### Settings Update
- [ ] Settings update notifies all members (BOTH audience)
- [ ] Notification lists all changed settings
- [ ] Notification links to settings entity

### General
- [ ] All notifications are scoped to correct chamaId
- [ ] Notifications appear in GET /notifications
- [ ] Statistics endpoint returns correct counts
- [ ] Mark as read updates readAt timestamp
- [ ] Mark all as read updates multiple notifications
- [ ] Pagination works correctly
- [ ] Filtering by status works (all, unread, action)
- [ ] Filtering by audience works (ADMIN, MEMBER)

---

## Database Verification

### Check Notifications in Database
```sql
-- View all notifications for a chama
SELECT 
  n.id,
  n.title,
  n.body,
  n.action_required,
  n.read_at,
  nt.key as type_key,
  u.name as user_name
FROM notification n
JOIN notification_type nt ON n.type_id = nt.id
JOIN "user" u ON n.user_id = u.id
WHERE n.chama_id = 'YOUR_CHAMA_ID'
ORDER BY n."createdAt" DESC;

-- Check notification statistics
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN read_at IS NULL THEN 1 END) as unread,
  COUNT(CASE WHEN action_required = true AND read_at IS NULL THEN 1 END) as action_required
FROM notification
WHERE user_id = 'YOUR_USER_ID' AND chama_id = 'YOUR_CHAMA_ID';
```

---

## Troubleshooting

### No Notifications Created

**Check:**
1. Notification types are seeded: `SELECT * FROM notification_type;`
2. User has correct permissions: `SELECT * FROM member_role WHERE user_id = 'xxx';`
3. Backend logs for errors: Check console output
4. NotificationsModule is imported in service modules

### Notifications Not Appearing

**Check:**
1. User is a member of the chama: `SELECT * FROM membership WHERE user_id = 'xxx' AND chama_id = 'xxx';`
2. Correct chamaId in query parameters
3. User authentication token is valid
4. Database indexes are created: `\d notification` in psql

### Permission-Based Targeting Not Working

**Check:**
1. Permissions exist: `SELECT * FROM permission WHERE key = 'member.approve';`
2. Roles have permissions: `SELECT * FROM role_permission;`
3. Users have roles: `SELECT * FROM member_role;`
4. RBAC system is properly configured

---

## Performance Testing

### Test Batch Notification Creation

Create multiple join requests quickly to test batch notification creation:

```bash
# Create 10 join requests in parallel
for i in {1..10}; do
  curl -X POST http://localhost:5500/api/v1/chamas/{chamaId}/requests \
    -H "Authorization: Bearer USER_${i}_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"message": "Test request '$i'"}' &
done
wait

# Check admin received all notifications
curl -X GET "http://localhost:5500/api/v1/notifications/stats?chamaId={chamaId}&audience=ADMIN" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Expected: All notifications created efficiently with batch operations.

---

## Next Steps

After successful testing:

1. ✅ Verify all scenarios pass
2. ✅ Check database for correct data
3. ✅ Monitor backend logs for errors
4. ✅ Test with real user workflows
5. 🔄 Integrate frontend notification UI
6. 🔄 Add WebSocket for real-time updates
7. 🔄 Add email notification delivery
8. 🔄 Add SMS notification delivery

---

## Support

For issues or questions:
1. Check `INTEGRATION_COMPLETE.md` for implementation details
2. Check `README.md` for API documentation
3. Check `MIGRATION_GUIDE.md` for setup instructions
4. Review backend logs for error messages

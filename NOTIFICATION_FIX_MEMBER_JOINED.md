# Member Join Notification Fix

## Problem
When a new member joined a chama, no notification appeared for admins. This was happening because:

1. The notification system was trying to use RBAC (Role-Based Access Control) to find users with the `member.view` permission
2. When RBAC is not set up in a chama, the permission-based resolution returns an empty array
3. The system had a fallback for permission-based targeting, BUT the ADMIN audience resolution also relied on RBAC
4. Result: No notifications were created at all

## Root Cause
The `member.joined` notification flow:
```typescript
// In join-request.service.ts
await this.notificationsService.notify('member.joined', {
  chamaId,
  title: 'New Member Joined',
  body: `${userName} has joined the chama`,
  entityType: 'member',
  entityId: userId,
  permissionKey: 'member.view', // ❌ This fails when RBAC not set up
});
```

The notification type has `default_audience: ADMIN`, but the ADMIN audience resolution was also using RBAC:
```typescript
// Old code - ADMIN resolution
if (roleIds.length === 0) {
  return []; // ❌ Returns empty when no RBAC roles
}
```

## Solution Implemented

### Fix 1: Fallback from Permission to Audience (Already Done)
When permission-based resolution returns no users, fall back to the notification type's default audience:

```typescript
if (payload.permissionKey) {
  targetUserIds = await this.resolveUsersByPermission(
    payload.chamaId,
    payload.permissionKey
  );
  
  // FALLBACK: If no users found via permission (RBAC not set up)
  if (targetUserIds.length === 0) {
    this.logger.warn(
      `No users found with permission '${payload.permissionKey}', falling back to default audience`
    );
    targetUserIds = await this.resolveUsersByAudience(
      payload.chamaId,
      notificationType.default_audience
    );
  }
}
```

### Fix 2: ADMIN Audience Fallback to Legacy user_role (NEW)
When RBAC roles are not found, use the legacy `user_role` field from the membership table:

```typescript
if (audience === NotificationAudience.ADMIN) {
  // Try RBAC first...
  const roleIds = [...new Set(rolePermissions.map((rp) => rp.role_id))];

  if (roleIds.length === 0) {
    // FALLBACK: Use legacy user_role from membership
    this.logger.warn(
      `No RBAC roles found for ADMIN audience, falling back to legacy user_role`
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
  // Continue with RBAC...
}
```

## Files Modified
- `chama-core/src/notifications/notifications.service.ts`
  - Added fallback in `notify()` method (line ~60-70)
  - Added fallback in `resolveUsersByAudience()` for ADMIN audience (line ~210-225)

## Testing Instructions

### Test 1: Approve a Join Request
1. Have a user submit a join request to your chama
2. As chairperson, go to Members page
3. Approve the join request
4. Go to Notifications page
5. ✅ You should see: "New Member Joined - [Name] has joined the chama"

### Test 2: Check Backend Logs
When you approve a join request, check the backend logs for:
```
[NotificationsService] No users found with permission 'member.view' in chama [id], falling back to default audience
[NotificationsService] No RBAC roles found for ADMIN audience in chama [id], falling back to legacy user_role
[NotificationsService] Created X notifications of type 'member.joined' for chama [id]
```

### Test 3: Verify Notification in Database
```sql
SELECT * FROM notification 
WHERE type_id = (SELECT id FROM notification_type WHERE key = 'member.joined')
ORDER BY "createdAt" DESC 
LIMIT 5;
```

## Expected Behavior

### Before Fix
- ❌ No notification created when member joins
- ❌ Silent failure (no error, just empty targetUserIds)
- ❌ Admins have no visibility of new members

### After Fix
- ✅ Notification created for all admins (CHAIRPERSON, TREASURER, SECRETARY)
- ✅ Warning logged when falling back to legacy roles
- ✅ Works whether RBAC is set up or not
- ✅ Admins see "New Member Joined" notification

## Related Notifications That May Need Similar Fixes

These notifications also use `permissionKey` and may need testing:
1. `contribution.received` - uses `finance.view` permission
2. `chama.settings.updated` - uses `chama.update` permission

These should now work with the fallback logic, but verify in testing.

## Backend Status
✅ Backend restarted successfully
✅ Fix applied and running
✅ Ready for testing

## Next Steps
1. Test by approving a join request
2. Verify notification appears in UI
3. Check backend logs for fallback warnings
4. If working, test other permission-based notifications (contributions, settings)

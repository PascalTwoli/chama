# Notification Badge Update Fix

## Problem
The notification bell badge in the top-right header was hardcoded to show "3" and never updated based on actual unread notifications.

## Solution Implemented

### 1. Created Event System for Cross-Component Communication
**File**: `chama-frontend/src/utils/notification-events.ts`

Created a simple custom event system that allows components to notify each other when notification counts change:

```typescript
export const NOTIFICATION_EVENTS = {
  UPDATED: 'notifications:updated',
} as const;

export const dispatchNotificationUpdate = () => {
  window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENTS.UPDATED));
};

export const onNotificationUpdate = (callback: () => void) => {
  window.addEventListener(NOTIFICATION_EVENTS.UPDATED, callback);
  return () => window.removeEventListener(NOTIFICATION_EVENTS.UPDATED, callback);
};
```

### 2. Updated Navbar to Fetch and Display Real Count
**File**: `chama-frontend/src/components/navbars/Navbar.tsx`

Changes made:
- Added `unreadCount` state
- Imported `NotificationsService` and `onNotificationUpdate`
- Added useEffect to fetch notification stats on mount and every 30 seconds
- Listen for manual update events when user marks notifications as read
- Updated badge to show actual count (or hide if 0)
- Show "99+" for counts over 99

```typescript
// Fetch unread notification count
useEffect(() => {
  const fetchUnreadCount = async () => {
    if (!chamaId) return;
    try {
      const stats = await NotificationsService.getStats(
        chamaId,
        dashboardContext === 'admin' ? 'ADMIN' : 'MEMBER'
      );
      setUnreadCount(stats.unread);
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };

  fetchUnreadCount();
  const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
  const cleanup = onNotificationUpdate(fetchUnreadCount); // Listen for updates

  return () => {
    clearInterval(interval);
    cleanup();
  };
}, [chamaId, dashboardContext]);
```

Badge rendering:
```typescript
{unreadCount > 0 && (
  <span className='absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center'>
    {unreadCount > 99 ? '99+' : unreadCount}
  </span>
)}
```

### 3. Updated NotificationsPage to Dispatch Events
**File**: `chama-frontend/src/pages/NotificationsPage.tsx`

Changes made:
- Imported `dispatchNotificationUpdate`
- Call `dispatchNotificationUpdate()` after marking notification(s) as read
- This triggers the Navbar to refresh its count immediately

```typescript
const markRead = async (id: string) => {
  // ... mark as read logic ...
  dispatchNotificationUpdate(); // ← Notify Navbar
};

const markAllRead = async () => {
  // ... mark all as read logic ...
  dispatchNotificationUpdate(); // ← Notify Navbar
};
```

## How It Works

### Initial Load
1. User navigates to any page with a chamaId
2. Navbar fetches notification stats via `NotificationsService.getStats()`
3. Badge displays the unread count (or hides if 0)

### Automatic Updates
1. Every 30 seconds, Navbar polls for new notification stats
2. This catches new notifications created by backend events

### Manual Updates
1. User clicks on a notification to mark it as read
2. NotificationsPage calls `dispatchNotificationUpdate()`
3. Navbar's event listener triggers and refetches the count
4. Badge updates immediately without page refresh

### Dashboard Context Awareness
- Badge shows ADMIN notifications when in admin dashboard
- Badge shows MEMBER notifications when in member dashboard
- Automatically updates when user switches dashboards

## Files Modified
1. ✅ `chama-frontend/src/utils/notification-events.ts` (NEW)
2. ✅ `chama-frontend/src/components/navbars/Navbar.tsx`
3. ✅ `chama-frontend/src/pages/NotificationsPage.tsx`

## Testing Instructions

### Test 1: Initial Badge Display
1. Login and navigate to a chama
2. Check the notification bell in the top-right
3. ✅ Badge should show actual unread count (or be hidden if 0)

### Test 2: Mark Single Notification as Read
1. Go to Notifications page
2. Click on an unread notification
3. ✅ Badge count should decrease by 1 immediately

### Test 3: Mark All as Read
1. Go to Notifications page with multiple unread notifications
2. Click "Mark All Read" button
3. ✅ Badge should disappear immediately

### Test 4: New Notification Appears
1. Have another user trigger a notification (e.g., approve join request)
2. Wait up to 30 seconds
3. ✅ Badge should update to show new count

### Test 5: Dashboard Switch
1. Switch from Admin to Member dashboard (or vice versa)
2. ✅ Badge should update to show correct count for that context

### Test 6: Badge Display for Large Numbers
1. Create 100+ unread notifications (via backend/database)
2. ✅ Badge should show "99+" instead of full number

## Expected Behavior

### Before Fix
- ❌ Badge always showed "3"
- ❌ Never updated when notifications were read
- ❌ No way to see actual unread count

### After Fix
- ✅ Badge shows actual unread count
- ✅ Updates immediately when marking as read
- ✅ Polls every 30 seconds for new notifications
- ✅ Hides when count is 0
- ✅ Shows "99+" for large numbers
- ✅ Context-aware (ADMIN vs MEMBER)

## Performance Considerations
- Polling interval: 30 seconds (configurable)
- API call is lightweight (just stats, not full notifications)
- Event system uses native browser events (no external dependencies)
- Cleanup functions prevent memory leaks

## Future Enhancements
Consider implementing:
1. WebSocket connection for real-time updates (eliminate polling)
2. Service Worker for background sync
3. Push notifications for mobile/desktop
4. Configurable polling interval in user settings

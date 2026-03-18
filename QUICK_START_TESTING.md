# Quick Start: Testing Notifications System

## ✅ System Status
- Backend: Running on http://localhost:5500
- Frontend: Running on http://localhost:3000
- Database: Reset and migrated successfully
- Notification types: 17 types seeded

---

## 🚀 Quick Test Steps

### Step 1: Verify Swagger Documentation
1. Open: **http://localhost:5500/api/docs**
2. Look for the **"Notifications"** section
3. You should see 4 endpoints:
   - `GET /api/notifications`
   - `GET /api/notifications/stats`
   - `PUT /api/notifications/{id}/read`
   - `PUT /api/notifications/read-all`

### Step 2: Login and Get Auth Token
1. Open frontend: **http://localhost:3000**
2. Login with your credentials
3. Open browser DevTools → Application → Local Storage
4. Copy your auth token (you'll need this for API testing)

### Step 3: Create Test Data
Since the database was reset, you need to create some test data:

1. **Create a chama** (if you don't have one)
2. **Get your chama ID** from the URL or API response
3. **Note your user ID** from the auth token or profile

### Step 4: Trigger Notifications

#### Option A: Via UI (Easiest)
1. Submit a join request to a chama
2. Have an admin approve/reject it
3. Record a contribution
4. Update chama settings

#### Option B: Via API (Direct)
Use the existing endpoints to trigger events:

**Submit Join Request:**
```bash
curl -X POST http://localhost:5500/api/v1/chamas/YOUR_CHAMA_ID/requests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "I would like to join"}'
```

**Record Contribution:**
```bash
curl -X POST http://localhost:5500/api/v1/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CONTRIBUTION",
    "amount": 1000,
    "chamaId": "YOUR_CHAMA_ID",
    "description": "Monthly contribution"
  }'
```

**Update Settings:**
```bash
curl -X PUT http://localhost:5500/api/v1/chamas/YOUR_CHAMA_ID/settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contribution_model": "FIXED",
    "contribution_amount": 5000
  }'
```

### Step 5: View Notifications

#### Via UI:
1. Navigate to **Notifications** page in the app
2. You should see the notifications created from Step 4
3. Try:
   - Clicking "Mark as read" on a notification
   - Clicking "Mark all as read"
   - Filtering by "Unread" or "Action Required"

#### Via API:
```bash
# Get notifications
curl -X GET "http://localhost:5500/api/v1/notifications?chamaId=YOUR_CHAMA_ID&limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get stats
curl -X GET "http://localhost:5500/api/v1/notifications/stats?chamaId=YOUR_CHAMA_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 What to Look For

### In the UI:
- ✅ Notifications load without errors
- ✅ Unread count badge shows correct number
- ✅ Action required count shows correct number
- ✅ Notifications display with proper formatting
- ✅ Time stamps show relative time ("2 hours ago")
- ✅ Mark as read updates immediately
- ✅ Filters work correctly
- ✅ Empty state shows when no notifications

### In the API Response:
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "New join request from John Doe",
      "body": "John Doe has requested to join your chama",
      "audience": "ADMIN",
      "actionRequired": true,
      "readAt": null,
      "createdAt": "2026-03-13T00:00:00.000Z",
      "entityType": "join_request",
      "entityId": "request-id",
      "notificationType": {
        "key": "join_request.new",
        "description": "New join request submitted"
      },
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "total": 1,
  "unreadCount": 1,
  "actionRequiredCount": 1
}
```

---

## 🐛 Troubleshooting

### "401 Unauthorized" Error
- **Cause**: Auth token expired or invalid
- **Fix**: Refresh browser or login again

### "No notifications found"
- **Cause**: No test data created yet
- **Fix**: Follow Step 4 to trigger notifications

### "Endpoints not in Swagger"
- **Cause**: Backend not restarted after migration
- **Fix**: Backend was already restarted, refresh Swagger page

### "Database column not found"
- **Cause**: Database not migrated
- **Fix**: Already fixed! Database was reset and migrated

---

## 📊 Expected Notification Flow

### Join Request Flow:
1. User submits join request
   → Admin receives: "New join request from [User]" (action required)

2. Admin approves request
   → Applicant receives: "Your join request has been approved"
   → All admins receive: "[User] has joined the chama"

3. Admin rejects request
   → Applicant receives: "Your join request has been rejected"

### Contribution Flow:
1. Contribution recorded
   → Contributor receives: "Your contribution of [amount] has been received"
   → Admins with `finance.view` receive: "[User] contributed [amount]"

### Settings Update Flow:
1. Settings updated
   → All members receive: "Chama settings have been updated"
   → Body lists what changed

---

## 🎯 Success Criteria

You'll know everything is working when:
- ✅ Swagger shows all 4 notification endpoints
- ✅ API returns notifications without errors
- ✅ UI displays notifications correctly
- ✅ Mark as read functionality works
- ✅ Filters work correctly
- ✅ Stats show correct counts
- ✅ Notifications are created automatically when events occur

---

## 📝 Notes

- The database was reset, so all previous data is gone
- You'll need to recreate users, chamas, and memberships
- Notification types are already seeded (17 types)
- Backend and frontend are both running
- All TypeScript compilation is successful

---

## 🆘 Need Help?

If something isn't working:
1. Check backend logs in the terminal
2. Check browser console for frontend errors
3. Verify your auth token is valid
4. Ensure you have the correct chamaId
5. Check that you have proper permissions in the chama

---

**Ready to test? Start with Step 1!** 🚀

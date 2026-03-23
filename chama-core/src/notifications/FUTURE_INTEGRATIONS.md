# Notifications Module - Future Integration Guide

This document details the remaining service integrations needed to activate all seeded notification types.

## Current Status

✅ **Fully Integrated** (6 of 17 notification types):

- `member.joined` - JoinRequestService
- `join_request.new` - JoinRequestService
- `join_request.approved` - JoinRequestService
- `join_request.rejected` - JoinRequestService
- `contribution.received` - TransactionService
- `chama.settings.updated` - ChamaSettingsService

❌ **Not Yet Integrated** (11 of 17 notification types):

- Loan events (6 types) - **LoanService doesn't exist**
- Contribution reminders (2 types) - **No contribution scheduler**
- Meeting notifications (2 types) - **MeetingService doesn't exist**
- Member left event (1 type) - **No removal functionality**

---

## Missing Integrations & Implementation Guide

### 1. Loan Service Integrations (6 types)

**Seeded notification types:**

- `loan.request` - User requests a loan
- `loan.approved` - Loan approved
- `loan.rejected` - Loan rejected
- `loan.repayment.due` - Repayment reminder (scheduled)

**When to implement:**
Once `LoanService` is created with methods to create, approve, and reject loans.

**Required integrations:**

#### 1a. Loan Request Created

```typescript
// In LoanService.createLoanRequest()
// After creating the loan record:

await this.notificationsService.notify('loan.request', {
  chamaId,
  entityType: 'loan',
  entityId: loanId,
  title: 'New Loan Request',
  body: `Member ${borrowerName} has requested a loan of ${amount}`,
  permissionKey: 'issue_loans', // Notify users with loan permissions
});
```

#### 1b. Loan Approved

```typescript
// In LoanService.approveLoan()
// After updating loan status to APPROVED:

await this.notificationsService.notify('loan.approved', {
  chamaId,
  targetUserIds: [borrowerId], // Notify only the borrower
  entityType: 'loan',
  entityId: loanId,
  title: 'Loan Approved',
  body: `Your loan request has been approved. Amount: ${amount}`,
});
```

#### 1c. Loan Rejected

```typescript
// In LoanService.rejectLoan()
// After updating loan status to REJECTED:

await this.notificationsService.notify('loan.rejected', {
  chamaId,
  targetUserIds: [borrowerId], // Notify only the borrower
  entityType: 'loan',
  entityId: loanId,
  title: 'Loan Request Rejected',
  body: `Your loan request has been rejected. Reason: ${rejectionReason}`,
});
```

#### 1d. Loan Repayment Due (Scheduled Task)

```typescript
// Create a scheduled job (using @nestjs/schedule or a cron service)
// Runs daily to check for upcoming or overdue loan repayments:

@Cron('0 9 * * *') // Every day at 9 AM
async notifyLoanRepaymentsDue() {
  const upcomingRepayments = await this.loanService.getUpcomingRepayments();

  for (const repayment of upcomingRepayments) {
    await this.notificationsService.notify('loan.repayment.due', {
      chamaId: repayment.chamaId,
      targetUserIds: [repayment.borrowerId],
      entityType: 'loan',
      entityId: repayment.loanId,
      title: 'Loan Repayment Due Soon',
      body: `Your loan repayment of ${repayment.amount} is due on ${repayment.dueDate}`,
    });
  }
}
```

---

### 2. Contribution Service Integrations (2 types)

**Seeded notification types:**

- `contribution.reminder` - Monthly contribution reminder
- `contribution.late` - Late payment warning

**When to implement:**
Once a contribution scheduler/tracking system is set up (separate from TransactionService).

**Required integrations:**

#### 2a. Contribution Reminder (Scheduled Task)

```typescript
// Create a scheduled job that runs before contribution due date
// Example: If contributions due on 1st of month, run on 28th

@Cron('0 14 28 * *') // 2 PM on 28th of every month
async notifyContributionReminders() {
  const chamas = await this.chamaSe rvice.findAll();

  for (const chama of chamas) {
    const members = await this.memberService.getChamaMembers(chama.id);

    for (const member of members) {
      await this.notificationsService.notify('contribution.reminder', {
        chamaId: chama.id,
        targetUserIds: [member.user_id],
        title: `Contribution Due - ${chama.name}`,
        body: `Your monthly contribution of ${chama.contributionAmount} is due on ${chama.contributionDueDay}. Please make your payment by then.`,
        actionRequired: true,
      });
    }
  }
}
```

#### 2b. Late Contribution Warning

```typescript
// Create a scheduled job that runs after due date
// Example: On 5th of month if due on 1st

@Cron('0 10 5 * *') // 10 AM on 5th of every month
async notifyLateContributions() {
  const chamas = await this.chamaService.findAll();

  for (const chama of chamas) {
    const lateMembers = await this.transactionService.getLateContributors(chamaId, daysLate);

    for (const member of lateMembers) {
      await this.notificationsService.notify('contribution.late', {
        chamaId: chama.id,
        targetUserIds: [member.user_id],
        title: `Late Contribution Warning`,
        body: `Your contribution to ${chama.name} was due on ${chama.contributionDueDay}. Please remit payment immediately to avoid penalties.`,
        actionRequired: true,
      });
    }
  }
}
```

---

### 3. Meeting Service Integrations (2 types)

**Seeded notification types:**

- `meeting.scheduled` - New meeting scheduled
- `meeting.reminder` - Upcoming meeting reminder

**When to implement:**
Once `MeetingService` with meeting creation and scheduling is implemented.

**Required integrations:**

#### 3a. Meeting Scheduled

```typescript
// In MeetingService.createMeeting()
// After creating the meeting record:

await this.notificationsService.notify('meeting.scheduled', {
  chamaId,
  // BOTH audience = all members
  entityType: 'meeting',
  entityId: meetingId,
  title: `New Meeting Scheduled: ${meetingTitle}`,
  body: `A meeting has been scheduled for ${meetingDate} at ${meetingTime}. Location: ${location}`,
});
```

**Note:** For BOTH audience, the service automatically notifies all members.

#### 3b. Meeting Reminder (Scheduled Task)

```typescript
// Create a scheduled job that runs 24 hours before meeting
// Adjust the cron expression based on meeting frequency

@Cron('0 9 * * *') // Every day at 9 AM
async notifyUpcomingMeetings() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingMeetings = await this.meetingService.getMeetingsOnDate(tomorrow);

  for (const meeting of upcomingMeetings) {
    await this.notificationsService.notify('meeting.reminder', {
      chamaId: meeting.chamaId,
      // BOTH audience = all members
      entityType: 'meeting',
      entityId: meeting.id,
      title: `Reminder: Meeting Tomorrow`,
      body: `Don't forget: ${meeting.title} is scheduled for tomorrow at ${meeting.startTime}. Location: ${meeting.location}`,
    });
  }
}
```

---

### 4. Member Left Integration (1 type)

**Seeded notification type:**

- `member.left` - Member left the chama

**When to implement:**
Once member removal/leaving functionality is added to ChamaService or MemberService.

**Required integration:**

```typescript
// In ChamaService or MemberService.removeMember()
// After removing member from chama:

await this.notificationsService.notify('member.left', {
  chamaId,
  permissionKey: 'manage_members', // Notify members with management permissions
  entityType: 'member',
  entityId: memberId,
  title: `Member Left: ${memberName}`,
  body: `${memberName} has left the chama. Chama membership is now ${remainingMemberCount} members.`,
});
```

---

### 5. Future Optional Integrations

The following notification types are seeded but may require new features:

#### `expense.recorded`

- Requires: ExpenseService
- Trigger: When new expense is recorded
- Audience: ADMIN (users with `record_expenses` permission)

#### `report.generated`

- Requires: ReportService or scheduled report generation
- Trigger: When financial/activity report is generated
- Audience: ADMIN (users with `generate_reports` permission)

---

## Integration Checklist

When implementing each service:

- [ ] Create the service/controller if not exists
- [ ] Add NotificationsModule as a dependency
- [ ] Inject NotificationsService into the service
- [ ] Add the notification trigger after the main action completes
- [ ] Handle errors gracefully (notification failures shouldn't break the main action)
- [ ] Test that notifications are created with correct audience and payload
- [ ] Document the notification trigger in the service's Swagger/OpenAPI documentation

## Testing Integration

After implementing an integration, verify:

```bash
# 1. Check notifications are created
psql -d chama_db -c "SELECT COUNT(*) FROM \"notification\" WHERE type_id = (SELECT id FROM notification_type WHERE key = 'your.notification.key');"

# 2. Verify correct audience
psql -d chama_db -c "SELECT DISTINCT audience FROM \"notification\" WHERE type_id = (SELECT id FROM notification_type WHERE key = 'your.notification.key');"

# 3. Test with API endpoint
GET /notifications?chamaId=YOUR_CHAMA_ID
```

## Architecture Notes

**Permission-Based Audience Resolution:**
The service automatically resolves ADMIN audience by checking these permission keys:

- `manage_members`
- `change_member_roles`
- `modify_chama_settings`
- `record_contributions`
- `record_expenses`
- `issue_loans`
- `audit_financial_records`
- `view_financial_reports`
- `schedule_meetings`
- `generate_reports`

If you add new admin-level features, consider adding their permission keys to the ADMIN_PERMISSION_KEYS list in `notifications.service.ts`.

**Error Handling:**
Notification failures are logged but don't prevent the main action. This is intentional - a notification creation failure shouldn't break a loan approval or meeting scheduling. However, always test to ensure notifications are created successfully.

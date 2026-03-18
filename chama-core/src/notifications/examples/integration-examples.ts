/**
 * Integration Examples for Notifications Module
 * 
 * This file demonstrates how to integrate the notifications module
 * with other parts of the ChamaPlus application.
 */

import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';

/**
 * Example 1: Join Request Service Integration
 */
@Injectable()
export class JoinRequestsServiceExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  async approveJoinRequest(requestId: string, chamaId: string, userId: string, userName: string) {
    // ... approve logic ...

    // Notify the user their request was approved
    await this.notificationsService.notify('join_request.approved', {
      chamaId,
      title: 'Join Request Approved',
      body: 'Your request to join has been approved. Welcome to the chama!',
      entityType: 'join_request',
      entityId: requestId,
      targetUserIds: [userId],
    });

    // Notify admins that a new member joined
    await this.notificationsService.notify('member.joined', {
      chamaId,
      title: 'New Member Joined',
      body: `${userName} has joined the chama`,
      entityType: 'member',
      entityId: userId,
      // Uses default_audience (ADMIN) from notification_type
    });
  }

  async rejectJoinRequest(requestId: string, chamaId: string, userId: string, reason?: string) {
    // ... reject logic ...

    await this.notificationsService.notify('join_request.rejected', {
      chamaId,
      title: 'Join Request Declined',
      body: reason || 'Your request to join has been declined',
      entityType: 'join_request',
      entityId: requestId,
      targetUserIds: [userId],
    });
  }

  async createJoinRequest(requestId: string, chamaId: string, userName: string) {
    // ... create logic ...

    // Notify admins about new join request
    await this.notificationsService.notify('join_request.new', {
      chamaId,
      title: 'New Join Request',
      body: `${userName} wants to join the chama`,
      entityType: 'join_request',
      entityId: requestId,
      // Notifies users with 'member.approve' permission
      permissionKey: 'member.approve',
    });
  }
}

/**
 * Example 2: Loan Service Integration
 */
@Injectable()
export class LoanServiceExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  async createLoanRequest(loanId: string, chamaId: string, userId: string, amount: number) {
    // ... create loan logic ...

    // Notify users who can review loans
    await this.notificationsService.notify('loan.request', {
      chamaId,
      title: 'New Loan Request',
      body: `A member has requested a loan of KSh ${amount.toLocaleString()}`,
      entityType: 'loan',
      entityId: loanId,
      permissionKey: 'loan.review', // Only users with this permission
    });
  }

  async approveLoan(loanId: string, chamaId: string, userId: string, amount: number) {
    // ... approve logic ...

    await this.notificationsService.notify('loan.approved', {
      chamaId,
      title: 'Loan Approved',
      body: `Your loan request of KSh ${amount.toLocaleString()} has been approved`,
      entityType: 'loan',
      entityId: loanId,
      targetUserIds: [userId],
    });
  }

  async rejectLoan(loanId: string, chamaId: string, userId: string, reason?: string) {
    // ... reject logic ...

    await this.notificationsService.notify('loan.rejected', {
      chamaId,
      title: 'Loan Request Declined',
      body: reason || 'Your loan request has been declined',
      entityType: 'loan',
      entityId: loanId,
      targetUserIds: [userId],
    });
  }

  async sendRepaymentReminder(loanId: string, chamaId: string, userId: string, amount: number, dueDate: Date) {
    await this.notificationsService.notify('loan.repayment.due', {
      chamaId,
      title: 'Loan Repayment Due',
      body: `Your loan repayment of KSh ${amount.toLocaleString()} is due on ${dueDate.toLocaleDateString()}`,
      entityType: 'loan',
      entityId: loanId,
      targetUserIds: [userId],
    });
  }
}

/**
 * Example 3: Contribution Service Integration
 */
@Injectable()
export class ContributionServiceExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  async recordContribution(contributionId: string, chamaId: string, userId: string, amount: number) {
    // ... record contribution logic ...

    await this.notificationsService.notify('contribution.received', {
      chamaId,
      title: 'Contribution Received',
      body: `Your contribution of KSh ${amount.toLocaleString()} has been received. Thank you!`,
      entityType: 'contribution',
      entityId: contributionId,
      targetUserIds: [userId],
    });
  }

  async sendContributionReminders(chamaId: string, memberIds: string[], amount: number, dueDate: Date) {
    // Send reminder to multiple members
    await this.notificationsService.notify('contribution.reminder', {
      chamaId,
      title: 'Contribution Reminder',
      body: `Your monthly contribution of KSh ${amount.toLocaleString()} is due on ${dueDate.toLocaleDateString()}`,
      entityType: 'contribution',
      targetUserIds: memberIds,
    });
  }

  async sendLatePaymentWarning(chamaId: string, userId: string, amount: number, daysLate: number) {
    await this.notificationsService.notify('contribution.late', {
      chamaId,
      title: 'Late Payment Warning',
      body: `Your contribution of KSh ${amount.toLocaleString()} is ${daysLate} days overdue. Please pay as soon as possible.`,
      entityType: 'contribution',
      targetUserIds: [userId],
    });
  }
}

/**
 * Example 4: Meeting Service Integration
 */
@Injectable()
export class MeetingServiceExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  async scheduleMeeting(meetingId: string, chamaId: string, title: string, date: Date) {
    // ... schedule meeting logic ...

    // Notify all members (BOTH audience)
    await this.notificationsService.notify('meeting.scheduled', {
      chamaId,
      title: 'New Meeting Scheduled',
      body: `${title} has been scheduled for ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`,
      entityType: 'meeting',
      entityId: meetingId,
    });
  }

  async sendMeetingReminder(meetingId: string, chamaId: string, title: string, date: Date) {
    await this.notificationsService.notify('meeting.reminder', {
      chamaId,
      title: 'Meeting Reminder',
      body: `Reminder: ${title} is tomorrow at ${date.toLocaleTimeString()}`,
      entityType: 'meeting',
      entityId: meetingId,
    });
  }
}

/**
 * Example 5: Chama Settings Service Integration
 */
@Injectable()
export class ChamaSettingsServiceExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  async updateSettings(chamaId: string, changes: string[]) {
    // ... update settings logic ...

    await this.notificationsService.notify('chama.settings.updated', {
      chamaId,
      title: 'Chama Settings Updated',
      body: `The following settings have been updated: ${changes.join(', ')}`,
      entityType: 'chama_settings',
      entityId: chamaId,
    });
  }
}

/**
 * Example 6: Expense Service Integration
 */
@Injectable()
export class ExpenseServiceExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  async recordExpense(expenseId: string, chamaId: string, description: string, amount: number) {
    // ... record expense logic ...

    // Notify admins only
    await this.notificationsService.notify('expense.recorded', {
      chamaId,
      title: 'New Expense Recorded',
      body: `${description}: KSh ${amount.toLocaleString()}`,
      entityType: 'expense',
      entityId: expenseId,
    });
  }
}

/**
 * Example 7: Report Service Integration
 */
@Injectable()
export class ReportServiceExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  async generateReport(reportId: string, chamaId: string, reportType: string) {
    // ... generate report logic ...

    await this.notificationsService.notify('report.generated', {
      chamaId,
      title: 'Report Generated',
      body: `Your ${reportType} report is ready to view`,
      entityType: 'report',
      entityId: reportId,
      permissionKey: 'report.view', // Only users who can view reports
    });
  }
}

/**
 * Example 8: Scheduled Job - Daily Contribution Reminders
 */
@Injectable()
export class NotificationSchedulerExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Run this daily via cron job
  async sendDailyContributionReminders() {
    interface ChamaWithContributions {
      id: string;
      contributionAmount: number;
    }
    
    interface UnpaidMember {
      userId: string;
    }
    
    // Get all chamas with contributions due soon
    const chamasWithDueContributions: ChamaWithContributions[] = []; // ... fetch from DB

    for (const chama of chamasWithDueContributions) {
      // Get members who haven't paid
      const unpaidMembers: UnpaidMember[] = []; // ... fetch from DB

      if (unpaidMembers.length > 0) {
        await this.notificationsService.notify('contribution.reminder', {
          chamaId: chama.id,
          title: 'Contribution Reminder',
          body: `Your monthly contribution of KSh ${chama.contributionAmount.toLocaleString()} is due in 3 days`,
          entityType: 'contribution',
          targetUserIds: unpaidMembers.map(m => m.userId),
        });
      }
    }
  }

  // Run this daily via cron job
  async sendMeetingReminders() {
    interface UpcomingMeeting {
      id: string;
      chamaId: string;
      title: string;
      time: string;
    }
    
    // Get meetings happening tomorrow
    const upcomingMeetings: UpcomingMeeting[] = []; // ... fetch from DB

    for (const meeting of upcomingMeetings) {
      await this.notificationsService.notify('meeting.reminder', {
        chamaId: meeting.chamaId,
        title: 'Meeting Tomorrow',
        body: `Reminder: ${meeting.title} is tomorrow at ${meeting.time}`,
        entityType: 'meeting',
        entityId: meeting.id,
      });
    }
  }
}

/**
 * Example 9: Bulk Operations
 */
@Injectable()
export class BulkNotificationExample {
  constructor(private readonly notificationsService: NotificationsService) {}

  async notifyAllChamaMembers(chamaId: string, title: string, body: string) {
    // Notify all members in a chama
    await this.notificationsService.notify('chama.settings.updated', {
      chamaId,
      title,
      body,
      entityType: 'chama',
      entityId: chamaId,
      // No targetUserIds or permissionKey = uses default_audience (BOTH)
    });
  }

  async notifySpecificRole(chamaId: string, permissionKey: string, title: string, body: string) {
    // Notify users with specific permission
    await this.notificationsService.notify('chama.settings.updated', {
      chamaId,
      title,
      body,
      permissionKey, // e.g., 'finance.manage'
    });
  }
}

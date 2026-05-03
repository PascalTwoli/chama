/**
 * Default permissions available in the system.
 */
export const DEFAULT_PERMISSIONS = [
  {
    key: 'view_financial_reports',
    description: 'View financial reports and summaries',
  },
  {
    key: 'record_contributions',
    description: 'Record member contributions',
  },
  {
    key: 'record_expenses',
    description: 'Record chama expenses',
  },
  {
    key: 'issue_loans',
    description: 'Issue loans to members',
  },
  {
    key: 'loan.view',
    description: 'View loans and loan details',
  },
  {
    key: 'loan.create',
    description: 'Create loans directly (admin)',
  },
  {
    key: 'loan.request',
    description: 'Request a loan as a member',
  },
  {
    key: 'loan.review',
    description: 'Move loan to under review',
  },
  {
    key: 'loan.approve',
    description: 'Approve a loan request',
  },
  {
    key: 'loan.reject',
    description: 'Reject a loan request',
  },
  {
    key: 'loan.disburse',
    description: 'Disburse an approved loan',
  },
  {
    key: 'loan.repayment.record',
    description: 'Record a loan repayment',
  },
  {
    key: 'loan.mark.defaulted',
    description: 'Mark a loan as defaulted',
  },
  {
    key: 'loan.stats.view',
    description: 'View loan statistics',
  },
  {
    key: 'contribution.view',
    description: 'View contribution periods, board, and history',
  },
  {
    key: 'contribution.record',
    description: 'Record member contribution payments',
  },
  {
    key: 'contribution.export',
    description: 'Export contribution data to CSV',
  },
  {
    key: 'contribution.manage_periods',
    description: 'Open and close contribution periods',
  },
  {
    key: 'manage_members',
    description: 'Add, remove, or manage chama members',
  },
  {
    key: 'change_member_roles',
    description: 'Assign or change member roles',
  },
  {
    key: 'modify_chama_settings',
    description: 'Modify chama configuration and settings',
  },
  {
    key: 'schedule_meetings',
    description: 'Schedule and manage meetings',
  },
  {
    key: 'send_announcements',
    description: 'Send announcements to members',
  },
  {
    key: 'audit_financial_records',
    description: 'Audit and review financial records',
  },
  {
    key: 'view_activity_log',
    description: 'View activity and audit logs',
  },
  {
    key: 'generate_reports',
    description: 'Generate and export reports',
  },
];

/**
 * Default organizational roles with their predefined permissions.
 */
export const DEFAULT_ROLES: {
  name: string;
  description: string;
  permissions: string[];
}[] = [
  {
    name: 'Chairperson',
    description: 'Full access to all Chama features and settings',
    permissions: [
      'view_financial_reports',
      'record_contributions',
      'record_expenses',
      'issue_loans',
      'manage_members',
      'change_member_roles',
      'modify_chama_settings',
      'schedule_meetings',
      'send_announcements',
      'audit_financial_records',
      'view_activity_log',
      'generate_reports',
      'loan.view',
      'loan.create',
      'loan.review',
      'loan.approve',
      'loan.reject',
      'loan.disburse',
      'loan.repayment.record',
      'loan.mark.defaulted',
      'loan.stats.view',
      'contribution.view',
      'contribution.record',
      'contribution.export',
      'contribution.manage_periods',
    ],
  },
  {
    name: 'Treasurer',
    description: 'Manages finances, contributions, expenses, and loans',
    permissions: [
      'view_financial_reports',
      'record_contributions',
      'record_expenses',
      'issue_loans',
      'view_activity_log',
      'generate_reports',
      'loan.view',
      'loan.create',
      'loan.review',
      'loan.approve',
      'loan.reject',
      'loan.disburse',
      'loan.repayment.record',
      'loan.mark.defaulted',
      'loan.stats.view',
      'contribution.view',
      'contribution.record',
      'contribution.export',
      'contribution.manage_periods',
    ],
  },
  {
    name: 'Secretary',
    description: 'Manages membership, meetings, and communications',
    permissions: [
      'manage_members',
      'schedule_meetings',
      'send_announcements',
      'view_activity_log',
      'generate_reports',
    ],
  },
  {
    name: 'Auditor',
    description: 'Reviews financial records and generates audit reports',
    permissions: [
      'view_financial_reports',
      'audit_financial_records',
      'view_activity_log',
      'generate_reports',
    ],
  },
  {
    name: 'General Member',
    description: 'View reports and make contributions',
    permissions: [
      'view_financial_reports',
      'generate_reports',
    ],
  },
];

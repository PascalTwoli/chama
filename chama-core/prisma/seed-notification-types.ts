import { PrismaClient, NotificationAudience } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNotificationTypes() {
  const types = [
    {
      key: 'contribution.reminder',
      description: 'Reminder to make monthly contribution',
      default_audience: NotificationAudience.MEMBER,
      action_required: true,
    },
    {
      key: 'contribution.received',
      description: 'Contribution received confirmation',
      default_audience: NotificationAudience.MEMBER,
      action_required: false,
    },
    {
      key: 'contribution.late',
      description: 'Late contribution warning',
      default_audience: NotificationAudience.MEMBER,
      action_required: true,
    },
    {
      key: 'loan.request',
      description: 'New loan request submitted',
      default_audience: NotificationAudience.ADMIN,
      action_required: true,
    },
    {
      key: 'loan.approved',
      description: 'Loan request approved',
      default_audience: NotificationAudience.MEMBER,
      action_required: false,
    },
    {
      key: 'loan.rejected',
      description: 'Loan request rejected',
      default_audience: NotificationAudience.MEMBER,
      action_required: false,
    },
    {
      key: 'loan.repayment.due',
      description: 'Loan repayment due reminder',
      default_audience: NotificationAudience.MEMBER,
      action_required: true,
    },
    {
      key: 'loan.disbursed',
      description: 'Loan has been disbursed to borrower',
      default_audience: NotificationAudience.MEMBER,
      action_required: false,
    },
    {
      key: 'loan.repayment.recorded',
      description: 'Loan repayment recorded',
      default_audience: NotificationAudience.MEMBER,
      action_required: false,
    },
    {
      key: 'loan.defaulted',
      description: 'Loan marked as defaulted',
      default_audience: NotificationAudience.BOTH,
      action_required: false,
    },
    {
      key: 'meeting.scheduled',
      description: 'New meeting scheduled',
      default_audience: NotificationAudience.BOTH,
      action_required: false,
    },
    {
      key: 'meeting.reminder',
      description: 'Upcoming meeting reminder',
      default_audience: NotificationAudience.BOTH,
      action_required: false,
    },
    {
      key: 'member.joined',
      description: 'New member joined the chama',
      default_audience: NotificationAudience.ADMIN,
      action_required: false,
    },
    {
      key: 'member.left',
      description: 'Member left the chama',
      default_audience: NotificationAudience.ADMIN,
      action_required: false,
    },
    {
      key: 'join_request.new',
      description: 'New join request received',
      default_audience: NotificationAudience.ADMIN,
      action_required: true,
    },
    {
      key: 'join_request.approved',
      description: 'Join request approved',
      default_audience: NotificationAudience.MEMBER,
      action_required: false,
    },
    {
      key: 'join_request.rejected',
      description: 'Join request rejected',
      default_audience: NotificationAudience.MEMBER,
      action_required: false,
    },
    {
      key: 'chama.settings.updated',
      description: 'Chama settings updated',
      default_audience: NotificationAudience.BOTH,
      action_required: false,
    },
    {
      key: 'expense.recorded',
      description: 'New expense recorded',
      default_audience: NotificationAudience.ADMIN,
      action_required: false,
    },
    {
      key: 'report.generated',
      description: 'Financial report generated',
      default_audience: NotificationAudience.ADMIN,
      action_required: false,
    },
  ];

  console.log('Seeding notification types...');

  for (const type of types) {
    await prisma.notification_type.upsert({
      where: { key: type.key },
      update: {
        description: type.description,
        default_audience: type.default_audience,
        action_required: type.action_required,
      },
      create: {
        id: crypto.randomUUID(),
        key: type.key,
        description: type.description,
        default_audience: type.default_audience,
        action_required: type.action_required,
      },
    });
  }

  console.log(`✅ Seeded ${types.length} notification types`);
}

seedNotificationTypes()
  .catch((e) => {
    console.error('Error seeding notification types:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

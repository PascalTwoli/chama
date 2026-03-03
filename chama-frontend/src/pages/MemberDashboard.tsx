import React from 'react';
import { useParams } from 'react-router-dom';
import { Wallet, Calendar, TrendingUp, ArrowUpRight, Plus } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// Contribution history data matching Figma
const contributionHistory = [
  { month: 'Aug', amount: 4500 },
  { month: 'Sep', amount: 4500 },
  { month: 'Oct', amount: 4500 },
  { month: 'Nov', amount: 4500 },
  { month: 'Dec', amount: 5000 },
  { month: 'Jan', amount: 5200 },
];

// Recent payments matching Figma
const recentPayments = [
  {
    id: 1,
    amount: 'KSh 5,000',
    date: 'Jan 5, 2026',
    reference: 'QBX7H3KN1M',
    status: 'Confirmed',
  },
  {
    id: 2,
    amount: 'KSh 5,000',
    date: 'Dec 5, 2025',
    reference: 'PNAO8BF4WG',
    status: 'Confirmed',
  },
  {
    id: 3,
    amount: 'KSh 5,000',
    date: 'Nov 5, 2025',
    reference: 'ZRT9K5L2NP',
    status: 'Confirmed',
  },
  {
    id: 4,
    amount: 'KSh 5,000',
    date: 'Oct 5, 2025',
    reference: 'XYZ1A6B7C9',
    status: 'Confirmed',
  },
];

// Upcoming events matching Figma
const upcomingEvents = [
  {
    id: 1,
    title: 'Monthly Meeting',
    date: 'Jan 15, 2026 at 6:00 PM',
    type: 'meeting',
  },
  {
    id: 2,
    title: 'Contribution Deadline',
    date: 'Jan 20, 2026 at 11:59 PM',
    type: 'deadline',
  },
  {
    id: 3,
    title: 'Quarterly Report',
    date: 'Feb 1, 2026 at 9:00 AM',
    type: 'report',
  },
];

interface MemberStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  icon: React.ReactNode;
}

function MemberStatCard({
  title,
  value,
  subtitle,
  change,
  icon,
}: MemberStatCardProps) {
  return (
    <Card className='border border-border'>
      <CardContent className='p-5'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>{title}</p>
            <p className='text-2xl font-bold text-foreground'>{value}</p>
            {change && (
              <div className='flex items-center gap-1 mt-1'>
                <ArrowUpRight className='w-4 h-4 text-green-600' />
                <span className='text-sm font-medium text-green-600'>
                  {change}
                </span>
              </div>
            )}
            {subtitle && (
              <p className='text-sm text-muted-foreground mt-1'>{subtitle}</p>
            )}
          </div>
          <div className='p-2 bg-muted rounded-lg text-muted-foreground'>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MemberDashboard() {
  useParams<{ chamaId: string }>();

  return (
    <div className='p-6 space-y-6 bg-background min-h-full'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <MemberStatCard
          title='My Total Savings'
          value='KSh 85,000'
          change='+5,000'
          icon={<Wallet className='w-5 h-5' />}
        />
        <MemberStatCard
          title='This Month'
          value='KSh 5,000'
          subtitle='Paid'
          icon={<TrendingUp className='w-5 h-5' />}
        />
        <MemberStatCard
          title='My Share'
          value='12.5%'
          subtitle='of total'
          icon={<TrendingUp className='w-5 h-5' />}
        />
        <MemberStatCard
          title='Next Meeting'
          value='Jan 15'
          subtitle='3 days'
          icon={<Calendar className='w-5 h-5' />}
        />
      </div>

      {/* My Contribution History Chart */}
      <Card className='border border-border'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg font-semibold'>
            My Contribution History
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            Your payment progress over time
          </p>
        </CardHeader>
        <CardContent>
          <div className='h-[250px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={contributionHistory}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  className='stroke-border'
                />
                <XAxis
                  dataKey='month'
                  axisLine={false}
                  tickLine={false}
                  className='text-xs fill-muted-foreground'
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className='text-xs fill-muted-foreground'
                  tickFormatter={value => `${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={value => [
                    `KSh ${(value as number).toLocaleString()}`,
                    'Contribution',
                  ]}
                />
                <Line
                  type='monotone'
                  dataKey='amount'
                  stroke='#2563eb'
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments + Chama Summary */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Recent Payments - Takes 2 columns */}
        <Card className='border border-border lg:col-span-2'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-semibold'>
              Recent Payments
            </CardTitle>
            <p className='text-sm text-muted-foreground'>
              Your M-Pesa transaction history
            </p>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentPayments.map(payment => (
                <div
                  key={payment.id}
                  className='flex items-center justify-between py-3 border-b border-border last:border-0'
                >
                  <div>
                    <p className='font-semibold text-foreground'>
                      {payment.amount}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {payment.date}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Ref: {payment.reference}
                    </p>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chama Summary - Takes 1 column */}
        <Card className='border border-border'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-semibold'>
              Chama Summary
            </CardTitle>
            <p className='text-sm text-muted-foreground'>Tumaini Chama</p>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Total Savings</p>
              <p className='text-2xl font-bold text-foreground'>KSh 2.45M</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Total Members</p>
              <p className='text-2xl font-bold text-foreground'>24</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Monthly Target</p>
              <p className='text-2xl font-bold text-foreground'>KSh 120K</p>
            </div>
            <Button className='w-full' size='lg'>
              <Plus className='w-4 h-4 mr-2' />
              Make Payment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className='border border-border'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg font-semibold'>
            Upcoming Events
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            Meetings and deadlines
          </p>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className='flex items-center gap-4 py-3 border-b border-border last:border-0'
              >
                <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <Calendar className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className='font-semibold text-foreground'>{event.title}</p>
                  <p className='text-sm text-muted-foreground'>{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

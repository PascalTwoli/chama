import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Wallet,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Calendar,
  UserPlus,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// Monthly contribution data matching Figma
const monthlyData = [
  { month: 'Aug', amount: 80000 },
  { month: 'Sep', amount: 120000 },
  { month: 'Oct', amount: 140000 },
  { month: 'Nov', amount: 100000 },
  { month: 'Dec', amount: 160000 },
  { month: 'Jan', amount: 180000 },
];

// Pie chart data matching Figma exactly
const contributionDistribution = [
  { name: 'Paid on Time', value: 83, color: '#22c55e' },
  { name: 'Pending', value: 4, color: '#f59e0b' },
  { name: 'Paid Late', value: 13, color: '#dc2626' },
];

// Recent contributions matching Figma
const recentContributions = [
  {
    id: 1,
    name: 'Mary Wanjiku',
    date: 'Jan 15, 2026',
    amount: 5000,
    status: 'Paid',
  },
  {
    id: 2,
    name: 'Peter Kamau',
    date: 'Jan 12, 2026',
    amount: 7500,
    status: 'Paid',
  },
  {
    id: 3,
    name: 'Grace Achieng',
    date: 'Jan 11, 2026',
    amount: 5000,
    status: 'Paid',
  },
  {
    id: 4,
    name: 'David Omondi',
    date: 'Jan 10, 2026',
    amount: 5000,
    status: 'Paid',
  },
  {
    id: 5,
    name: 'Faith Njeri',
    date: 'Jan 10, 2026',
    amount: 5000,
    status: 'Paid',
  },
];

// Members overview matching Figma
const membersOverview = [
  {
    id: 1,
    name: 'Mary Wanjiku',
    phone: '0712345678',
    savings: 75000,
    status: 'Paid',
  },
  {
    id: 2,
    name: 'Peter Kamau',
    phone: '0723456789',
    savings: 120000,
    status: 'Paid',
  },
  {
    id: 3,
    name: 'Grace Achieng',
    phone: '0734567890',
    savings: 85000,
    status: 'Paid',
  },
  {
    id: 4,
    name: 'David Omondi',
    phone: '0745678901',
    savings: 95000,
    status: 'Pending',
  },
  {
    id: 5,
    name: 'Faith Njeri',
    phone: '0756789012',
    savings: 68000,
    status: 'Paid',
  },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card className='border border-border'>
      <CardContent className='p-5'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>{title}</p>
            <p className='text-2xl font-bold text-foreground'>{value}</p>
            <div className='flex items-center gap-1 mt-1'>
              {trend === 'up' ? (
                <ArrowUpRight className='w-4 h-4 text-green-600' />
              ) : (
                <ArrowDownRight className='w-4 h-4 text-red-600' />
              )}
              <span
                className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
              >
                {change}
              </span>
            </div>
          </div>
          <div className='p-2 bg-muted rounded-lg text-muted-foreground'>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom label for pie chart
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      className='text-xs fill-foreground'
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AdminDashboard() {
  const { chamaId } = useParams<{ chamaId: string }>();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-cyan-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className='p-6 space-y-6 bg-background min-h-full'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome back! Here&apos;s what&apos;s happening
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          title='Total Savings'
          value='KSh 2,450,000'
          change='+12.5%'
          trend='up'
          icon={<Wallet className='w-5 h-5' />}
        />
        <StatCard
          title='Total Members'
          value='24'
          change='+2'
          trend='up'
          icon={<Users className='w-5 h-5' />}
        />
        <StatCard
          title='This Month'
          value='KSh 180,000'
          change='+8.5%'
          trend='up'
          icon={<TrendingUp className='w-5 h-5' />}
        />
        <StatCard
          title='Pending Payments'
          value='3'
          change='-2'
          trend='down'
          icon={<Clock className='w-5 h-5' />}
        />
      </div>

      {/* Charts Row */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Monthly Contributions Bar Chart */}
        <Card className='border border-border'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold'>
              Monthly Contributions
            </CardTitle>
            <p className='text-sm text-muted-foreground'>
              Last 6 months performance
            </p>
          </CardHeader>
          <CardContent>
            <div className='h-[250px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='var(--border)'
                    vertical={false}
                  />
                  <XAxis
                    dataKey='month'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickFormatter={value => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                    }}
                    formatter={(value: number | undefined) => [
                      `KSh ${(value ?? 0).toLocaleString()}`,
                      'Amount',
                    ]}
                  />
                  <Bar dataKey='amount' fill='#3b82f6' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contribution Distribution Pie Chart */}
        <Card className='border border-border'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold'>
              Contribution Distribution
            </CardTitle>
            <p className='text-sm text-muted-foreground'>By member status</p>
          </CardHeader>
          <CardContent>
            <div className='h-[250px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={contributionDistribution}
                    cx='50%'
                    cy='50%'
                    labelLine={true}
                    label={renderCustomLabel}
                    outerRadius={80}
                    dataKey='value'
                  >
                    {contributionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | undefined) => [
                      `${value ?? 0}%`,
                      '',
                    ]}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contributions & Quick Actions Row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Recent Contributions */}
        <Card className='lg:col-span-2 border border-border'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div>
              <CardTitle className='text-base font-semibold'>
                Recent Contributions
              </CardTitle>
              <p className='text-sm text-muted-foreground'>
                Latest M-Pesa payments received
              </p>
            </div>
            <Button variant='ghost' size='sm' className='text-primary'>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {recentContributions.map(contribution => (
                <div
                  key={contribution.id}
                  className='flex items-center justify-between py-2 border-b border-border last:border-0'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-9 h-9 rounded-full ${getAvatarColor(contribution.name)} flex items-center justify-center`}
                    >
                      <span className='text-primary-foreground font-semibold text-xs'>
                        {getInitials(contribution.name)}
                      </span>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-foreground'>
                        {contribution.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {contribution.date}
                      </p>
                    </div>
                  </div>
                  <div className='text-right flex items-center gap-3'>
                    <p className='text-sm font-semibold text-foreground'>
                      KSh {contribution.amount.toLocaleString()}
                    </p>
                    <Badge variant='success' className='text-xs'>
                      {contribution.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className='border border-border'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold'>
              Quick Actions
            </CardTitle>
            <p className='text-sm text-muted-foreground'>Common tasks</p>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Button
              className='w-full justify-start gap-3'
              onClick={() =>
                navigate(`/admin/chamas/${chamaId}/record-contribution`)
              }
            >
              <Plus className='w-4 h-4' />
              Record Contribution
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start gap-3'
              onClick={() => navigate(`/admin/chamas/${chamaId}/invite-member`)}
            >
              <UserPlus className='w-4 h-4' />
              Invite Member
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start gap-3'
              onClick={() => navigate(`/admin/chamas/${chamaId}/meetings`)}
            >
              <Calendar className='w-4 h-4' />
              Schedule Meeting
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start gap-3'
              onClick={() => navigate(`/admin/chamas/${chamaId}/reports`)}
            >
              <FileText className='w-4 h-4' />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Members Overview Table */}
      <Card className='border border-border'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <div>
            <CardTitle className='text-base font-semibold'>
              Members Overview
            </CardTitle>
            <p className='text-sm text-muted-foreground'>24 active members</p>
          </div>
          <Button size='sm' className='gap-2'>
            <Plus className='w-4 h-4' />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-border'>
                  <th className='text-left py-3 px-2 text-sm font-medium text-muted-foreground'>
                    Member
                  </th>
                  <th className='text-left py-3 px-2 text-sm font-medium text-muted-foreground'>
                    Phone
                  </th>
                  <th className='text-left py-3 px-2 text-sm font-medium text-muted-foreground'>
                    Total Savings
                  </th>
                  <th className='text-left py-3 px-2 text-sm font-medium text-muted-foreground'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {membersOverview.map(member => (
                  <tr
                    key={member.id}
                    className='border-b border-border last:border-0'
                  >
                    <td className='py-3 px-2'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`w-8 h-8 rounded-full ${getAvatarColor(member.name)} flex items-center justify-center`}
                        >
                          <span className='text-primary-foreground font-semibold text-xs'>
                            {getInitials(member.name)}
                          </span>
                        </div>
                        <span className='text-sm font-medium text-foreground'>
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className='py-3 px-2 text-sm text-muted-foreground'>
                      {member.phone}
                    </td>
                    <td className='py-3 px-2 text-sm font-medium text-foreground'>
                      KSh {member.savings.toLocaleString()}
                    </td>
                    <td className='py-3 px-2'>
                      <Badge
                        variant={
                          member.status === 'Paid' ? 'success' : 'warning'
                        }
                        className='text-xs'
                      >
                        {member.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

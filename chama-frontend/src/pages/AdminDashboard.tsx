import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardService, {
  DashboardData,
} from '../services/dashboard/dashboard-service';
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

const defaultDashboard: DashboardData = {
  totalSavings: 0,
  totalMembers: 0,
  thisMonthTotal: 0,
  pendingPaymentsCount: 0,
  monthlyContributions: [],
  contributionDistribution: [
    { name: 'Paid on Time', value: 0, color: '#22c55e' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Paid Late', value: 0, color: '#dc2626' },
  ],
  recentContributions: [],
  membersOverview: [],
};

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
            <p className='text-sm text-muted-foreground m-0'>{title}</p>
            <p className='text-2xl font-bold text-foreground m-0'>{value}</p>
            <div className='flex items-center gap-1 mt-0'>
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

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  name?: string;
}

// Custom label for pie chart
const renderCustomLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
  name = '',
}: CustomLabelProps) => {
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
      fill={
        name === 'Paid on Time'
          ? '#22c55e'
          : name === 'Pending'
            ? '#f59e0b'
            : '#dc2626'
      }
      className='text-xs font-medium'
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AdminDashboard() {
  const { chamaId } = useParams<{ chamaId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>(defaultDashboard);

  const loadDashboard = useCallback(async () => {
    if (!chamaId) return;
    try {
      const result = await DashboardService.getDashboard(chamaId);
      setData(result);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to load dashboard'
      );
    }
  }, [chamaId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const onFocus = () => loadDashboard();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadDashboard]);

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
        <h1 className='text-2xl font-bold text-foreground m-0 mt-3'>
          Dashboard
        </h1>
        <p className='text-muted-foreground text-sm m-0'>
          Welcome back! Here&apos;s what&apos;s happening
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          title='Total Savings'
          value={`KSh ${data.totalSavings.toLocaleString()}`}
          change=''
          trend='up'
          icon={<Wallet className='w-5 h-5' />}
        />
        <StatCard
          title='Total Members'
          value={data.totalMembers.toString()}
          change=''
          trend='up'
          icon={<Users className='w-5 h-5' />}
        />
        <StatCard
          title='This Month'
          value={`KSh ${data.thisMonthTotal.toLocaleString()}`}
          change=''
          trend='up'
          icon={<TrendingUp className='w-5 h-5' />}
        />
        <StatCard
          title='Pending Payments'
          value={data.pendingPaymentsCount.toString()}
          change=''
          trend='down'
          icon={<Clock className='w-5 h-5' />}
        />
      </div>

      {/* Charts Row */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Monthly Contributions Bar Chart */}
        <Card className='border border-border'>
          <CardHeader className='py-4'>
            <CardTitle className='text-base font-semibold m-0'>
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
                  data={data.monthlyContributions}
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={
                      ((value: any) => [
                        `KSh ${(value ?? 0).toLocaleString()}`,
                        'Amount',
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ]) as any
                    }
                  />
                  <Bar dataKey='amount' fill='#3b82f6' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contribution Distribution Pie Chart */}
        <Card className='border border-border'>
          <CardHeader className='py-4 '>
            <CardTitle className='text-base font-semibold m-0'>
              Contribution Distribution
            </CardTitle>
            <p className='text-sm text-muted-foreground'>By member status</p>
          </CardHeader>
          <CardContent>
            <div className='h-[250px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={data.contributionDistribution}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    dataKey='value'
                  >
                    {data.contributionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={
                      ((value: any) => [
                        `${value ?? 0}%`,
                        '',
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ]) as any
                    }
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
          <CardHeader className='flex flex-row items-center justify-between py-4'>
            <div>
              <CardTitle className='text-base font-semibold m-0'>
                Recent Contributions
              </CardTitle>
              <p className='text-sm text-muted-foreground m-0'>
                Latest M-Pesa payments received
              </p>
            </div>
            <Button variant='outline' size='sm' className=''>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {data.recentContributions.map(contribution => (
                <div
                  key={contribution.id}
                  className='flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors'
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
                      <p className='text-sm font-medium text-foreground m-0 font-bold'>
                        {contribution.name}
                      </p>
                      <p className='text-xs text-muted-foreground m-0 font-semibold'>
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
          <CardHeader className='py-4'>
            <CardTitle className='text-base font-semibold m-0'>
              Quick Actions
            </CardTitle>
            <p className='text-sm text-muted-foreground m-0'>Common tasks</p>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Button
              className='w-full justify-start gap-3 h-8'
              onClick={() =>
                navigate(
                  `/admin/chamas/${chamaId}/contributions/record-contribution`
                )
              }
            >
              <Plus className='w-4 h-4' />
              Record Contribution
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start gap-3 h-8'
              onClick={() =>
                navigate(`/admin/chamas/${chamaId}/members/invite-member`)
              }
            >
              <UserPlus className='w-4 h-4' />
              Invite Member
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start gap-3 h-8'
              onClick={() =>
                navigate(`/admin/chamas/${chamaId}/meetings/schedule`)
              }
            >
              <Calendar className='w-4 h-4' />
              Schedule Meeting
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start gap-3 h-8'
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
        <CardHeader className='flex flex-row items-center justify-between py-4'>
          <div>
            <CardTitle className='text-base font-semibold m-0'>
              Members Overview
            </CardTitle>
            <p className='text-sm text-muted-foreground m-0'>
              {data.totalMembers} active members
            </p>
          </div>
          {/* Onclick redirect to members page */}
          <Button
            size='sm'
            className='gap-2'
            onClick={() =>
              navigate(`/admin/chamas/${chamaId}/members/invite-member`)
            }
          >
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
                {data.membersOverview.map(member => (
                  <tr
                    key={member.id}
                    className='border-b border-border last:border-0'
                  >
                    <td className='py-3 px-2 border-t border-border'>
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
                    <td className='py-3 px-2 text-sm text-muted-foreground border-t border-border'>
                      {member.phone}
                    </td>
                    <td className='py-3 px-2 text-sm font-medium text-foreground border-t border-border'>
                      KSh {member.savings.toLocaleString()}
                    </td>
                    <td className='py-3 px-2 border-t border-border'>
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

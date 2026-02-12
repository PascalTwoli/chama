import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Download, TrendingUp, Users, BarChart3, Wallet } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
  Legend,
} from 'recharts';
import { cn } from '../utils/cn';

// Mock Data for Charts
const contributionData = [
  { month: 'Aug', actual: 45000, target: 50000 },
  { month: 'Sep', actual: 50000, target: 50000 },
  { month: 'Oct', actual: 48000, target: 50000 },
  { month: 'Nov', actual: 52000, target: 50000 },
  { month: 'Dec', actual: 50000, target: 50000 },
  { month: 'Jan', actual: 38000, target: 50000 },
];

const paymentMethodsData = [
  { name: 'M-Pesa', value: 75, color: '#16a34a' }, // Green
  { name: 'Bank Transfer', value: 10, color: '#f59e0b' }, // Yellow/Orange
  { name: 'Cash', value: 15, color: '#3b82f6' }, // Blue
];

// Mock Transactions
const recentTransactions = [
  {
    id: 1,
    type: 'Contribution',
    user: 'John Kamau',
    amount: 5000,
    date: '15 Jan',
  },
  {
    id: 2,
    type: 'Contribution',
    user: 'Mary Wanjiku',
    amount: 5000,
    date: '14 Jan',
  },
  {
    id: 3,
    type: 'Contribution',
    user: 'Peter Ochieng',
    amount: 3500,
    date: '16 Jan',
  },
  {
    id: 4,
    type: 'Contribution',
    user: 'Grace Akinyi',
    amount: 5000,
    date: '10 Jan',
  },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>(
    'Monthly'
  );

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Reports & Analytics'
        subtitle='Comprehensive financial insights'
        action={
          <Button className='gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
            <Download className='w-4 h-4' />
            Download Report
          </Button>
        }
      />

      {/* Period Toggle */}
      <div className='flex gap-1 border rounded-lg p-1 bg-muted/20 w-fit'>
        {(['Monthly', 'Quarterly', 'Yearly'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
              period === p
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPIs Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Total Collected */}
        <Card>
          <CardContent className='p-6 space-y-2'>
            <div className='flex justify-between items-start'>
              <p className='text-sm text-muted-foreground font-medium'>
                Total Collected
              </p>
              <Wallet className='w-4 h-4 text-green-600' />
            </div>
            <div>
              <h3 className='text-2xl font-bold'>KSh 283,500</h3>
              <p className='text-xs text-destructive flex items-center mt-1'>
                <TrendingUp className='w-3 h-3 mr-1 rotate-180' />{' '}
                {/* Rotate mostly for visual differnece or just arrow down */}
                23% vs last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Collection Rate */}
        <Card>
          <CardContent className='p-6 space-y-4'>
            <div className='flex justify-between items-start'>
              <p className='text-sm text-muted-foreground font-medium'>
                Collection Rate
              </p>
              <TrendingUp className='w-4 h-4 text-blue-600' />
            </div>
            <div>
              <h3 className='text-2xl font-bold'>94.5%</h3>
              <div className='h-2 w-full bg-muted/50 rounded-full mt-2 overflow-hidden'>
                <div
                  className='h-full bg-green-600 rounded-full'
                  style={{ width: '94.5%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Members */}
        <Card>
          <CardContent className='p-6 space-y-2'>
            <div className='flex justify-between items-start'>
              <p className='text-sm text-muted-foreground font-medium'>
                Active Members
              </p>
              <Users className='w-4 h-4 text-orange-600' />
            </div>
            <div>
              <h3 className='text-2xl font-bold'>10/10</h3>
              <p className='text-xs text-muted-foreground mt-1'>
                All members active
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Avg Contribution */}
        <Card>
          <CardContent className='p-6 space-y-2'>
            <div className='flex justify-between items-start'>
              <p className='text-sm text-muted-foreground font-medium'>
                Avg Contribution
              </p>
              <BarChart3 className='w-4 h-4 text-blue-600' />
            </div>
            <div>
              <h3 className='text-2xl font-bold'>KSh 28,350</h3>
              <p className='text-xs text-muted-foreground mt-1'>
                Per member this period
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs / Filters - Placeholder or actual tabs */}
      <div className='bg-muted/10 border-b border-border flex gap-6 px-4 text-sm font-medium text-muted-foreground'>
        <button className='py-3 border-b-2 border-primary text-primary'>
          Overview
        </button>
        <button className='py-3 border-b-2 border-transparent hover:text-foreground'>
          Members
        </button>
        <button className='py-3 border-b-2 border-transparent hover:text-foreground'>
          Trends
        </button>
        <button className='py-3 border-b-2 border-transparent hover:text-foreground'>
          Financial
        </button>
      </div>

      {/* Charts Row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Bar Chart */}
        <Card className='lg:col-span-2 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>
              Monthly Contributions
            </CardTitle>
            <p className='text-sm text-muted-foreground'>
              Actual vs Target over last 6 months
            </p>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={contributionData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#E5E7EB'
                  />
                  <XAxis
                    dataKey='month'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={value => `${value / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend iconType='circle' />
                  <Bar
                    name='Actual'
                    dataKey='actual'
                    fill='#16a34a'
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    name='Target'
                    dataKey='target'
                    fill='#3b82f6'
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>
              Payment Methods
            </CardTitle>
            <p className='text-sm text-muted-foreground'>
              Distribution of payment methods used
            </p>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] w-full flex items-center justify-center relative'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey='value'
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout='vertical'
                    verticalAlign='middle'
                    align='right'
                    iconType='circle'
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text (Optional) */}
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                {/* Can put total or label here */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions List */}
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-semibold'>
            Recent Transactions
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            Latest financial activities
          </p>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentTransactions.map(tx => (
              <div
                key={tx.id}
                className='flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center'>
                    <TrendingUp className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='font-medium text-sm'>{tx.type}</p>
                    <p className='text-xs text-muted-foreground'>{tx.user}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-bold text-sm text-green-600'>
                    +KSh {tx.amount.toLocaleString()}
                  </p>
                  <p className='text-xs text-muted-foreground'>{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

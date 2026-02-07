import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Users,
  TrendingUp,
  Wallet,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  UserPlus,
  FileText,
  Home,
  BarChart3,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import RecordContribution from './RecordContribution';
import InviteMember from './InviteMember';
import ScheduleMeeting from './ScheduleMeeting';
import GenerateReport from './GenerateReport';
import MembersPage from './MembersPage';
import ChamaSettings from './ChamaSettings';
import ContributionsPage from './ContributionsPage';
import ReportsPage from './ReportsPage';
import MeetingsPage from './MeetingsPage';
import ExpensesPage from './ExpensesPage';
import LoansPage from './LoansPage';
import ActivityLogPage from './ActivityLogPage';
import MemberRolesPage from './MemberRolesPage';
import CommunicationPage from './CommunicationPage';

interface DashboardProps {
  role: 'admin' | 'member';
  onLogout: () => void;
}

type ActivePage =
  | 'dashboard'
  | 'record-contribution'
  | 'invite-member'
  | 'schedule-meeting'
  | 'generate-report'
  | 'members'
  | 'settings'
  | 'contributions'
  | 'reports'
  | 'meetings'
  | 'expenses'
  | 'loans'
  | 'activity-log'
  | 'roles'
  | 'communication';

export default function Dashboard({ role, onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [contributionModel, setContributionModel] = useState<
    'fixed' | 'flexible'
  >('fixed'); // This would come from settings

  // Render different pages based on activePage
  if (activePage === 'record-contribution') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <RecordContribution onBack={() => setActivePage('dashboard')} />
      </div>
    );
  }

  if (activePage === 'invite-member') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <InviteMember onBack={() => setActivePage('dashboard')} />
      </div>
    );
  }

  if (activePage === 'schedule-meeting') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <ScheduleMeeting onBack={() => setActivePage('dashboard')} />
      </div>
    );
  }

  if (activePage === 'generate-report') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <GenerateReport onBack={() => setActivePage('dashboard')} />
      </div>
    );
  }

  if (activePage === 'members') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <MembersPage onBack={() => setActivePage('dashboard')} />
      </div>
    );
  }

  if (activePage === 'settings') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <ChamaSettings onBack={() => setActivePage('dashboard')} />
      </div>
    );
  }

  if (activePage === 'contributions') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <ContributionsPage
          onBack={() => setActivePage('dashboard')}
          role={role}
        />
      </div>
    );
  }

  if (activePage === 'reports') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <ReportsPage onBack={() => setActivePage('dashboard')} role={role} />
      </div>
    );
  }

  if (activePage === 'meetings') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <MeetingsPage onBack={() => setActivePage('dashboard')} role={role} />
      </div>
    );
  }

  if (activePage === 'expenses') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <ExpensesPage onBack={() => setActivePage('dashboard')} role={role} />
      </div>
    );
  }

  if (activePage === 'loans') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <LoansPage onBack={() => setActivePage('dashboard')} role={role} />
      </div>
    );
  }

  if (activePage === 'activity-log') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <ActivityLogPage
          onBack={() => setActivePage('dashboard')}
          role={role}
        />
      </div>
    );
  }

  if (activePage === 'roles') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <MemberRolesPage
          onBack={() => setActivePage('dashboard')}
          role={role}
        />
      </div>
    );
  }

  if (activePage === 'communication') {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <CommunicationPage
          onBack={() => setActivePage('dashboard')}
          role={role}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold">ChamaPlus</p>
                  <p className="text-xs text-muted-foreground">
                    {role === 'admin' ? 'Admin' : 'Member'}
                  </p>
                </div>
              </div>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <NavItem
              icon={<Home className="w-5 h-5" />}
              label="Dashboard"
              active={activePage === 'dashboard'}
              onClick={() => setActivePage('dashboard')}
            />
            <NavItem
              icon={<DollarSign className="w-5 h-5" />}
              label="Contributions"
              active={activePage === 'contributions'}
              onClick={() => setActivePage('contributions')}
            />
            <NavItem
              icon={<Users className="w-5 h-5" />}
              label="Members"
              active={activePage === 'members'}
              onClick={() => setActivePage('members')}
            />
            <NavItem
              icon={<BarChart3 className="w-5 h-5" />}
              label="Reports"
              active={activePage === 'reports'}
              onClick={() => setActivePage('reports')}
            />
            <NavItem
              icon={<Calendar className="w-5 h-5" />}
              label="Meetings"
              active={activePage === 'meetings'}
              onClick={() => setActivePage('meetings')}
            />
            {role === 'admin' && (
              <NavItem
                icon={<Settings className="w-5 h-5" />}
                label="Settings"
                active={activePage === 'settings'}
                onClick={() => setActivePage('settings')}
              />
            )}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">JD</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">John Doe</p>
                <p className="text-xs text-muted-foreground">Tumaini Chama</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back! Here's what's happening
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {role === 'admin' ? (
            <AdminDashboard setActivePage={setActivePage} />
          ) : (
            <MemberDashboard />
          )}
        </main>
      </div>
    </div>
  );
}

function AdminDashboard({
  setActivePage,
}: {
  setActivePage: (page: ActivePage) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Savings"
          value="KSh 2,450,000"
          change="+12.5%"
          trend="up"
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard
          title="Total Members"
          value="24"
          change="+2"
          trend="up"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="This Month"
          value="KSh 180,000"
          change="+8.3%"
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Payments"
          value="3"
          change="-2"
          trend="down"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Contributions</CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyContributionsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contribution Distribution</CardTitle>
            <CardDescription>By member status</CardDescription>
          </CardHeader>
          <CardContent>
            <ContributionPieChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Contributions</CardTitle>
              <CardDescription>Latest M-Pesa payments received</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <RecentContributionsTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start bg-primary hover:bg-primary/90"
              onClick={() => setActivePage('record-contribution')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Contribution
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setActivePage('invite-member')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setActivePage('schedule-meeting')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setActivePage('generate-report')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members Overview</CardTitle>
            <CardDescription>24 active members</CardDescription>
          </div>
          <Button size="sm" onClick={() => setActivePage('members')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <MembersTable />
        </CardContent>
      </Card>
    </div>
  );
}

function MemberDashboard() {
  return (
    <div className="space-y-6">
      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Total Savings"
          value="KSh 85,000"
          change="+5,000"
          trend="up"
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard
          title="This Month"
          value="KSh 5,000"
          change="Paid"
          trend="neutral"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="My Share"
          value="12.5%"
          change="of total"
          trend="neutral"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Next Meeting"
          value="Jan 15"
          change="3 days"
          trend="neutral"
          icon={<Calendar className="w-5 h-5" />}
        />
      </div>

      {/* Contribution Overview */}
      <Card>
        <CardHeader>
          <CardTitle>My Contribution History</CardTitle>
          <CardDescription>Your payment progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <MemberContributionChart />
        </CardContent>
      </Card>

      {/* Payment History & Chama Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your M-Pesa transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberPaymentHistory />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chama Summary</CardTitle>
            <CardDescription>Tumaini Chama</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold">KSh 2.45M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Target</p>
              <p className="text-2xl font-bold">KSh 120K</p>
            </div>
            <div className="pt-4 border-t">
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Make Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Meetings and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingEvents />
        </CardContent>
      </Card>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg
        transition-colors
        ${
          active
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
        }
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <div className="flex items-center gap-1">
          {trend === 'up' && (
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          )}
          {trend === 'down' && (
            <ArrowDownRight className="w-4 h-4 text-red-600" />
          )}
          <p className={`text-sm ${trendColors[trend]}`}>{change}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyContributionsChart() {
  const data = [
    { month: 'Aug', amount: 145000 },
    { month: 'Sep', amount: 152000 },
    { month: 'Oct', amount: 168000 },
    { month: 'Nov', amount: 175000 },
    { month: 'Dec', amount: 162000 },
    { month: 'Jan', amount: 180000 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            color: '#1a1a1a',
            fontSize: '14px',
            fontWeight: '500',
          }}
          formatter={(value: any) => [
            `KSh ${value.toLocaleString()}`,
            'Amount',
          ]}
        />
        <Bar dataKey="amount" fill="#2F7CF7" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ContributionPieChart() {
  const data = [
    { name: 'Paid on Time', value: 20, color: '#0f7a3e' },
    { name: 'Paid Late', value: 3, color: '#ffa000' },
    { name: 'Pending', value: 1, color: '#d32f2f' },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            color: '#1a1a1a',
            fontSize: '14px',
            fontWeight: '500',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function MemberContributionChart() {
  const data = [
    { month: 'Aug', amount: 5000 },
    { month: 'Sep', amount: 5000 },
    { month: 'Oct', amount: 5000 },
    { month: 'Nov', amount: 5000 },
    { month: 'Dec', amount: 0 },
    { month: 'Jan', amount: 5000 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            color: '#1a1a1a',
            fontSize: '14px',
            fontWeight: '500',
          }}
          formatter={(value: any) => [
            `KSh ${value.toLocaleString()}`,
            'Amount',
          ]}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#2F7CF7"
          strokeWidth={2}
          dot={{ fill: '#2F7CF7' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function RecentContributionsTable() {
  const contributions = [
    {
      id: 1,
      name: 'Mary Wanjiku',
      amount: 5000,
      date: 'Jan 12, 2026',
      status: 'completed',
    },
    {
      id: 2,
      name: 'Peter Kamau',
      amount: 7500,
      date: 'Jan 12, 2026',
      status: 'completed',
    },
    {
      id: 3,
      name: 'Grace Achieng',
      amount: 5000,
      date: 'Jan 11, 2026',
      status: 'completed',
    },
    {
      id: 4,
      name: 'David Omondi',
      amount: 5000,
      date: 'Jan 10, 2026',
      status: 'completed',
    },
    {
      id: 5,
      name: 'Faith Njeri',
      amount: 5000,
      date: 'Jan 10, 2026',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-3">
      {contributions.map(contribution => (
        <div
          key={contribution.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-bold text-primary text-sm">
                {contribution.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </span>
            </div>
            <div>
              <p className="font-medium">{contribution.name}</p>
              <p className="text-sm text-muted-foreground">
                {contribution.date}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">
              KSh {contribution.amount.toLocaleString()}
            </p>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Paid
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function MemberPaymentHistory() {
  const payments = [
    {
      id: 1,
      amount: 5000,
      date: 'Jan 5, 2026',
      ref: 'QBX7H2K9LM',
      status: 'completed',
    },
    {
      id: 2,
      amount: 5000,
      date: 'Dec 5, 2025',
      ref: 'PNM3G8T4WQ',
      status: 'completed',
    },
    {
      id: 3,
      amount: 5000,
      date: 'Nov 5, 2025',
      ref: 'ZRT9K5L2NP',
      status: 'completed',
    },
    {
      id: 4,
      amount: 5000,
      date: 'Oct 5, 2025',
      ref: 'XYZ1A6B7CD',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-3">
      {payments.map(payment => (
        <div
          key={payment.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border"
        >
          <div>
            <p className="font-medium">KSh {payment.amount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{payment.date}</p>
            <p className="text-xs text-muted-foreground">Ref: {payment.ref}</p>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Confirmed
          </Badge>
        </div>
      ))}
    </div>
  );
}

function MembersTable() {
  const members = [
    {
      id: 1,
      name: 'Mary Wanjiku',
      phone: '0712345678',
      total: 75000,
      status: 'paid',
    },
    {
      id: 2,
      name: 'Peter Kamau',
      phone: '0723456789',
      total: 120000,
      status: 'paid',
    },
    {
      id: 3,
      name: 'Grace Achieng',
      phone: '0734567890',
      total: 85000,
      status: 'paid',
    },
    {
      id: 4,
      name: 'David Omondi',
      phone: '0745678901',
      total: 95000,
      status: 'pending',
    },
    {
      id: 5,
      name: 'Faith Njeri',
      phone: '0756789012',
      total: 68000,
      status: 'paid',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 text-sm font-medium text-muted-foreground">
              Member
            </th>
            <th className="pb-3 text-sm font-medium text-muted-foreground">
              Phone
            </th>
            <th className="pb-3 text-sm font-medium text-muted-foreground">
              Total Savings
            </th>
            <th className="pb-3 text-sm font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr
              key={member.id}
              className="border-b border-border last:border-0"
            >
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary text-xs">
                      {member.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </span>
                  </div>
                  <span className="font-medium">{member.name}</span>
                </div>
              </td>
              <td className="py-3 text-muted-foreground">{member.phone}</td>
              <td className="py-3 font-medium">
                KSh {member.total.toLocaleString()}
              </td>
              <td className="py-3">
                <Badge
                  variant="outline"
                  className={
                    member.status === 'paid'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }
                >
                  {member.status === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: 'Monthly Meeting',
      date: 'Jan 15, 2026',
      time: '6:00 PM',
      type: 'meeting',
    },
    {
      id: 2,
      title: 'Contribution Deadline',
      date: 'Jan 20, 2026',
      time: '11:59 PM',
      type: 'deadline',
    },
    {
      id: 3,
      title: 'Quarterly Report',
      date: 'Feb 1, 2026',
      time: '9:00 AM',
      type: 'report',
    },
  ];

  return (
    <div className="space-y-3">
      {events.map(event => (
        <div
          key={event.id}
          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-muted-foreground">
              {event.date} at {event.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

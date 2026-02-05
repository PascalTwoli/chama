import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  TrendingUp,
  FileText,
  Calendar,
  Users,
  Wallet,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock
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
  Cell
} from 'recharts';

interface ReportsPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

export default function ReportsPage({ onBack, role }: ReportsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Mock data for charts
  const monthlyContributions = [
    { month: 'Aug', amount: 45000, target: 50000 },
    { month: 'Sep', amount: 50000, target: 50000 },
    { month: 'Oct', amount: 48000, target: 50000 },
    { month: 'Nov', amount: 52000, target: 50000 },
    { month: 'Dec', amount: 50000, target: 50000 },
    { month: 'Jan', amount: 38500, target: 50000 },
  ];

  const contributionTrend = [
    { month: 'Aug', contributions: 9, members: 10 },
    { month: 'Sep', contributions: 10, members: 10 },
    { month: 'Oct', contributions: 9, members: 10 },
    { month: 'Nov', contributions: 10, members: 10 },
    { month: 'Dec', contributions: 10, members: 10 },
    { month: 'Jan', contributions: 7, members: 10 },
  ];

  const paymentMethods = [
    { name: 'M-Pesa', value: 75, color: '#0f7a3e' },
    { name: 'Cash', value: 15, color: '#2F7CF7' },
    { name: 'Bank Transfer', value: 10, color: '#ffa000' },
  ];

  const memberContributions = [
    { name: 'John Kamau', total: 30000, paid: 30000, status: 'On Track' },
    { name: 'Mary Wanjiku', total: 30000, paid: 30000, status: 'On Track' },
    { name: 'Peter Ochieng', total: 30000, paid: 28500, status: 'Behind' },
    { name: 'Grace Akinyi', total: 30000, paid: 30000, status: 'On Track' },
    { name: 'David Mwangi', total: 30000, paid: 25000, status: 'Behind' },
    { name: 'Sarah Njeri', total: 30000, paid: 20000, status: 'Behind' },
    { name: 'James Omondi', total: 30000, paid: 30000, status: 'On Track' },
    { name: 'Anne Chebet', total: 30000, paid: 30000, status: 'On Track' },
    { name: 'Paul Kiptoo', total: 30000, paid: 30000, status: 'On Track' },
    { name: 'Lucy Muthoni', total: 30000, paid: 30000, status: 'On Track' },
  ];

  const financialSummary = {
    totalCollected: 283500,
    totalExpected: 300000,
    collectionRate: 94.5,
    totalMembers: 10,
    activeMembers: 10,
    averageContribution: 28350,
    monthlyGrowth: -23,
  };

  const upcomingObligations = [
    { description: 'Monthly Contribution Due', amount: 50000, date: '2026-02-05', priority: 'high' },
    { description: 'Late Payment Penalties', amount: 300, date: '2026-01-20', priority: 'medium' },
  ];

  const recentTransactions = [
    { id: '1', type: 'Contribution', member: 'John Kamau', amount: 5000, date: '2026-01-15' },
    { id: '2', type: 'Contribution', member: 'Mary Wanjiku', amount: 5000, date: '2026-01-14' },
    { id: '3', type: 'Contribution', member: 'Peter Ochieng', amount: 3500, date: '2026-01-16' },
    { id: '4', type: 'Contribution', member: 'Grace Akinyi', amount: 5000, date: '2026-01-10' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium mb-1">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: KSh {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">Comprehensive financial insights</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={selectedPeriod === 'quarterly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('quarterly')}
            >
              Quarterly
            </Button>
            <Button
              variant={selectedPeriod === 'yearly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('yearly')}
            >
              Yearly
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <Wallet className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold">KSh {financialSummary.totalCollected.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm">
                <ArrowDownRight className="w-4 h-4 text-destructive" />
                <span className="text-destructive">{Math.abs(financialSummary.monthlyGrowth)}% vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">{financialSummary.collectionRate}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full" 
                  style={{ width: `${financialSummary.collectionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Active Members</p>
                <Users className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold">{financialSummary.activeMembers}/{financialSummary.totalMembers}</p>
              <p className="text-sm text-muted-foreground">All members active</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Avg Contribution</p>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">KSh {financialSummary.averageContribution.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Per member this period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Contributions Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Contributions</CardTitle>
                <CardDescription>Actual vs Target over last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyContributions}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        stroke="rgba(0,0,0,0.5)"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="rgba(0,0,0,0.5)"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" fill="#0f7a3e" radius={[4, 4, 0, 0]} name="Actual" />
                      <Bar dataKey="target" fill="#2F7CF7" radius={[4, 4, 0, 0]} name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">{transaction.member}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-secondary">+KSh {transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Contribution Summary</CardTitle>
              <CardDescription>Individual member performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberContributions.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold text-primary text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            KSh {member.paid.toLocaleString()} / KSh {member.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={member.status === 'On Track' 
                          ? 'bg-secondary/10 text-secondary border-secondary/20' 
                          : 'bg-accent/10 text-accent border-accent/20'
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${member.status === 'On Track' ? 'bg-secondary' : 'bg-accent'}`}
                        style={{ width: `${(member.paid / member.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contribution Trends</CardTitle>
              <CardDescription>Track contribution patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={contributionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      stroke="rgba(0,0,0,0.5)"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="rgba(0,0,0,0.5)"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="contributions" 
                      stroke="#0f7a3e" 
                      strokeWidth={2}
                      name="Contributions"
                      dot={{ fill: '#0f7a3e', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="members" 
                      stroke="#2F7CF7" 
                      strokeWidth={2}
                      name="Members"
                      dot={{ fill: '#2F7CF7', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Strong Consistency</p>
                    <p className="text-sm text-muted-foreground">94.5% collection rate maintained</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                  <Clock className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Current Month</p>
                    <p className="text-sm text-muted-foreground">3 pending payments remaining</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Growth Opportunity</p>
                    <p className="text-sm text-muted-foreground">Consider increasing targets</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Obligations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingObligations.map((obligation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{obligation.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(obligation.date).toLocaleDateString('en-KE')}
                      </p>
                    </div>
                    <p className="font-bold">KSh {obligation.amount.toLocaleString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Current period overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Total Expected</span>
                  <span className="font-bold">KSh {financialSummary.totalExpected.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Total Collected</span>
                  <span className="font-bold text-secondary">KSh {financialSummary.totalCollected.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className="font-bold text-destructive">
                    KSh {(financialSummary.totalExpected - financialSummary.totalCollected).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Collection Rate</span>
                  <span className="font-bold">{financialSummary.collectionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average per Member</span>
                  <span className="font-bold">KSh {financialSummary.averageContribution.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Download detailed reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Contribution Report (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Member Summary (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Financial Data (Excel)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Transaction History (CSV)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

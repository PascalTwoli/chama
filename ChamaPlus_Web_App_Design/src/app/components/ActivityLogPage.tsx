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
import { Input } from './ui/input';
import {
  ArrowLeft,
  Download,
  Search,
  Shield,
  UserPlus,
  UserMinus,
  Edit,
  DollarSign,
  Settings,
  FileText,
  Calendar,
  Clock,
  User,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ActivityLogPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

interface Activity {
  id: string;
  type:
    | 'member_added'
    | 'member_removed'
    | 'contribution_recorded'
    | 'expense_added'
    | 'loan_issued'
    | 'settings_changed'
    | 'role_changed'
    | 'report_generated';
  user: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export default function ActivityLogPage({
  onBack,
  role,
}: ActivityLogPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  // Mock data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'contribution_recorded',
      user: 'John Kamau (Admin)',
      action: 'Recorded contribution',
      details: 'Recorded KSh 5,000 contribution from Mary Wanjiku',
      timestamp: '2026-01-17 14:32:15',
      ipAddress: '197.254.45.123',
    },
    {
      id: '2',
      type: 'settings_changed',
      user: 'John Kamau (Admin)',
      action: 'Updated Chama settings',
      details: 'Changed contribution model from Fixed to Flexible',
      timestamp: '2026-01-17 12:15:08',
      ipAddress: '197.254.45.123',
    },
    {
      id: '3',
      type: 'member_added',
      user: 'John Kamau (Admin)',
      action: 'Added new member',
      details: 'Added Paul Kiptoo as a Regular Member',
      timestamp: '2026-01-16 16:45:22',
      ipAddress: '197.254.45.123',
    },
    {
      id: '4',
      type: 'loan_issued',
      user: 'Mary Wanjiku (Treasurer)',
      action: 'Issued loan',
      details: 'Issued KSh 50,000 loan to Peter Ochieng at 5% interest',
      timestamp: '2026-01-15 10:20:45',
      ipAddress: '41.90.189.234',
    },
    {
      id: '5',
      type: 'expense_added',
      user: 'Mary Wanjiku (Treasurer)',
      action: 'Recorded expense',
      details: 'Recorded KSh 5,000 expense for meeting venue rental',
      timestamp: '2026-01-15 09:15:33',
      ipAddress: '41.90.189.234',
    },
    {
      id: '6',
      type: 'role_changed',
      user: 'John Kamau (Admin)',
      action: 'Changed member role',
      details: 'Changed Sarah Njeri from Regular Member to Secretary',
      timestamp: '2026-01-14 18:30:12',
      ipAddress: '197.254.45.123',
    },
    {
      id: '7',
      type: 'report_generated',
      user: 'Grace Akinyi (Auditor)',
      action: 'Generated report',
      details: 'Generated Monthly Financial Report for December 2025',
      timestamp: '2026-01-12 11:45:20',
      ipAddress: '105.160.37.89',
    },
    {
      id: '8',
      type: 'member_removed',
      user: 'John Kamau (Admin)',
      action: 'Removed member',
      details: 'Removed David Otieno from the Chama',
      timestamp: '2026-01-10 13:20:45',
      ipAddress: '197.254.45.123',
    },
    {
      id: '9',
      type: 'contribution_recorded',
      user: 'John Kamau (Admin)',
      action: 'Recorded contribution',
      details: 'Recorded KSh 5,000 contribution from Grace Akinyi',
      timestamp: '2026-01-10 10:15:30',
      ipAddress: '197.254.45.123',
    },
    {
      id: '10',
      type: 'settings_changed',
      user: 'John Kamau (Admin)',
      action: 'Updated Chama settings',
      details: 'Updated late payment grace period from 5 to 3 days',
      timestamp: '2026-01-08 15:45:18',
      ipAddress: '197.254.45.123',
    },
  ];

  const activityTypes = {
    member_added: {
      icon: <UserPlus className="w-4 h-4" />,
      color: 'bg-secondary/10 text-secondary border-secondary/20',
      label: 'Member Added',
    },
    member_removed: {
      icon: <UserMinus className="w-4 h-4" />,
      color: 'bg-destructive/10 text-destructive border-destructive/20',
      label: 'Member Removed',
    },
    contribution_recorded: {
      icon: <DollarSign className="w-4 h-4" />,
      color: 'bg-primary/10 text-primary border-primary/20',
      label: 'Contribution',
    },
    expense_added: {
      icon: <DollarSign className="w-4 h-4" />,
      color: 'bg-accent/10 text-accent border-accent/20',
      label: 'Expense',
    },
    loan_issued: {
      icon: <DollarSign className="w-4 h-4" />,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      label: 'Loan Issued',
    },
    settings_changed: {
      icon: <Settings className="w-4 h-4" />,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      label: 'Settings',
    },
    role_changed: {
      icon: <Shield className="w-4 h-4" />,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Role Changed',
    },
    report_generated: {
      icon: <FileText className="w-4 h-4" />,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      label: 'Report',
    },
  };

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(activities.map(a => a.user)));

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch =
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'all' || activity.type === selectedType;
    const matchesUser =
      selectedUser === 'all' || activity.user === selectedUser;
    return matchesSearch && matchesType && matchesUser;
  });

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
            <h1 className="text-2xl font-bold">Activity Log</h1>
            <p className="text-sm text-muted-foreground">
              Complete audit trail of all Chama actions
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Log
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Activities
                </p>
                <p className="text-2xl font-bold">{activities.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Today's Activities
                </p>
                <p className="text-2xl font-bold">
                  {
                    activities.filter(
                      a =>
                        new Date(a.timestamp).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{uniqueUsers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="member_added">Member Added</SelectItem>
                <SelectItem value="member_removed">Member Removed</SelectItem>
                <SelectItem value="contribution_recorded">
                  Contributions
                </SelectItem>
                <SelectItem value="expense_added">Expenses</SelectItem>
                <SelectItem value="loan_issued">Loans</SelectItem>
                <SelectItem value="settings_changed">Settings</SelectItem>
                <SelectItem value="role_changed">Role Changes</SelectItem>
                <SelectItem value="report_generated">Reports</SelectItem>
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Chronological record of all actions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Details
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map(activity => (
                  <tr key={activity.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={activityTypes[activity.type].color}
                      >
                        <span className="flex items-center gap-1">
                          {activityTypes[activity.type].icon}
                          {activityTypes[activity.type].label}
                        </span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{activity.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{activity.action}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {activity.details}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {new Date(activity.timestamp).toLocaleString('en-KE', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-muted-foreground">
                      {activity.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredActivities.map(activity => (
              <Card key={activity.id} className="border">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge
                        variant="outline"
                        className={activityTypes[activity.type].color}
                      >
                        <span className="flex items-center gap-1">
                          {activityTypes[activity.type].icon}
                          {activityTypes[activity.type].label}
                        </span>
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.timestamp).toLocaleString('en-KE', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm">
                          {activity.user}
                        </span>
                      </div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.details}
                      </p>
                    </div>

                    {activity.ipAddress && (
                      <div className="text-xs text-muted-foreground font-mono pt-2 border-t">
                        IP: {activity.ipAddress}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No activities found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

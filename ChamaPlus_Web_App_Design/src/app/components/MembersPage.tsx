import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface MembersPageProps {
  onBack: () => void;
}

export default function MembersPage({ onBack }: MembersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const members = [
    { 
      id: 1, 
      name: 'Mary Wanjiku', 
      phone: '0712345678', 
      email: 'mary.w@email.com',
      joinDate: 'Jan 2024',
      totalContributions: 75000, 
      monthlyContribution: 5000,
      status: 'paid',
      attendance: 95,
      lastPayment: 'Jan 5, 2026'
    },
    { 
      id: 2, 
      name: 'Peter Kamau', 
      phone: '0723456789', 
      email: 'peter.k@email.com',
      joinDate: 'Feb 2024',
      totalContributions: 120000, 
      monthlyContribution: 7500,
      status: 'paid',
      attendance: 100,
      lastPayment: 'Jan 5, 2026'
    },
    { 
      id: 3, 
      name: 'Grace Achieng', 
      phone: '0734567890', 
      email: 'grace.a@email.com',
      joinDate: 'Mar 2024',
      totalContributions: 85000, 
      monthlyContribution: 5000,
      status: 'paid',
      attendance: 88,
      lastPayment: 'Jan 6, 2026'
    },
    { 
      id: 4, 
      name: 'David Omondi', 
      phone: '0745678901', 
      email: 'david.o@email.com',
      joinDate: 'Jan 2024',
      totalContributions: 95000, 
      monthlyContribution: 5000,
      status: 'pending',
      attendance: 75,
      lastPayment: 'Dec 5, 2025'
    },
    { 
      id: 5, 
      name: 'Faith Njeri', 
      phone: '0756789012', 
      email: 'faith.n@email.com',
      joinDate: 'Apr 2024',
      totalContributions: 68000, 
      monthlyContribution: 5000,
      status: 'paid',
      attendance: 92,
      lastPayment: 'Jan 5, 2026'
    },
    { 
      id: 6, 
      name: 'John Mwangi', 
      phone: '0767890123', 
      email: 'john.m@email.com',
      joinDate: 'Jan 2024',
      totalContributions: 110000, 
      monthlyContribution: 5000,
      status: 'pending',
      attendance: 70,
      lastPayment: 'Dec 5, 2025'
    },
    { 
      id: 7, 
      name: 'Sarah Wambui', 
      phone: '0778901234', 
      email: 'sarah.w@email.com',
      joinDate: 'May 2024',
      totalContributions: 45000, 
      monthlyContribution: 5000,
      status: 'paid',
      attendance: 85,
      lastPayment: 'Jan 7, 2026'
    },
    { 
      id: 8, 
      name: 'James Otieno', 
      phone: '0789012345', 
      email: 'james.o@email.com',
      joinDate: 'Feb 2024',
      totalContributions: 98000, 
      monthlyContribution: 5000,
      status: 'pending',
      attendance: 80,
      lastPayment: 'Dec 5, 2025'
    },
  ];

  const filteredMembers = members
    .filter(member => 
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.phone.includes(searchTerm)) &&
      (filterStatus === 'all' || member.status === filterStatus)
    );

  const totalMembers = members.length;
  const paidMembers = members.filter(m => m.status === 'paid').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const totalContributions = members.reduce((sum, m) => sum + m.totalContributions, 0);

  const selectedMemberData = members.find(m => m.id === selectedMember);

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
            <h1 className="text-2xl font-bold">Members</h1>
            <p className="text-sm text-muted-foreground">{totalMembers} total members</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Members</p>
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{totalMembers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Paid This Month</p>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{paidMembers}</p>
            <p className="text-sm text-green-600">
              {((paidMembers / totalMembers) * 100).toFixed(0)}% paid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending</p>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{pendingMembers}</p>
            <p className="text-sm text-yellow-600">Need follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">KSh {(totalContributions / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Members</CardTitle>
            <CardDescription>Manage and view member details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-primary' : ''}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'paid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('paid')}
                  className={filterStatus === 'paid' ? 'bg-primary' : ''}
                >
                  Paid
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                  className={filterStatus === 'pending' ? 'bg-primary' : ''}
                >
                  Pending
                </Button>
              </div>
            </div>

            {/* Members Table */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedMember === member.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </span>
                          <span>•</span>
                          <span>Joined {member.joinDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KSh {member.totalContributions.toLocaleString()}</p>
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
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Member Details</CardTitle>
            <CardDescription>
              {selectedMemberData ? 'View and manage member' : 'Select a member to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedMemberData ? (
              <div className="space-y-6">
                {/* Member Header */}
                <div className="text-center pb-4 border-b">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary">
                      {selectedMemberData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{selectedMemberData.name}</h3>
                  <Badge
                    variant="outline"
                    className={
                      selectedMemberData.status === 'paid'
                        ? 'bg-green-50 text-green-700 border-green-200 mt-2'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200 mt-2'
                    }
                  >
                    {selectedMemberData.status === 'paid' ? 'Payment Up to Date' : 'Payment Pending'}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Contact Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedMemberData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedMemberData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {selectedMemberData.joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Stats */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Financial Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm text-muted-foreground">Total Contributions</span>
                      <span className="font-bold">KSh {selectedMemberData.totalContributions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm text-muted-foreground">Monthly Amount</span>
                      <span className="font-bold">KSh {selectedMemberData.monthlyContribution.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm text-muted-foreground">Last Payment</span>
                      <span className="font-bold">{selectedMemberData.lastPayment}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm text-muted-foreground">Attendance Rate</span>
                      <span className="font-bold">{selectedMemberData.attendance}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Member
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a member from the list to view their details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

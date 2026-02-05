import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Search, 
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Wallet,
  TrendingUp,
  User,
  Eye,
  Phone
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface ContributionsPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

interface Contribution {
  id: string;
  memberName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'late';
  method: 'M-Pesa' | 'Cash' | 'Bank Transfer';
  mpesaCode?: string;
  phone?: string;
  month?: string;
}

export default function ContributionsPage({ onBack, role }: ContributionsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending' | 'late'>('all');
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data - in real app this would come from API
  const contributions: Contribution[] = [
    {
      id: '1',
      memberName: 'John Kamau',
      amount: 5000,
      date: '2026-01-15',
      status: 'completed',
      method: 'M-Pesa',
      mpesaCode: 'SAF5K2L3M4',
      phone: '0712345678',
      month: 'January 2026'
    },
    {
      id: '2',
      memberName: 'Mary Wanjiku',
      amount: 5000,
      date: '2026-01-14',
      status: 'completed',
      method: 'M-Pesa',
      mpesaCode: 'SAF6K3L4M5',
      phone: '0723456789',
      month: 'January 2026'
    },
    {
      id: '3',
      memberName: 'Peter Ochieng',
      amount: 3500,
      date: '2026-01-16',
      status: 'completed',
      method: 'Cash',
      month: 'January 2026'
    },
    {
      id: '4',
      memberName: 'Grace Akinyi',
      amount: 5000,
      date: '2026-01-10',
      status: 'completed',
      method: 'Bank Transfer',
      month: 'January 2026'
    },
    {
      id: '5',
      memberName: 'David Mwangi',
      amount: 5000,
      date: '2026-01-17',
      status: 'pending',
      method: 'M-Pesa',
      phone: '0745678901',
      month: 'January 2026'
    },
    {
      id: '6',
      memberName: 'Sarah Njeri',
      amount: 5000,
      date: '2026-01-03',
      status: 'late',
      method: 'M-Pesa',
      phone: '0756789012',
      month: 'January 2026'
    },
    {
      id: '7',
      memberName: 'John Kamau',
      amount: 5000,
      date: '2025-12-14',
      status: 'completed',
      method: 'M-Pesa',
      mpesaCode: 'SAF4K1L2M3',
      phone: '0712345678',
      month: 'December 2025'
    },
    {
      id: '8',
      memberName: 'Mary Wanjiku',
      amount: 5000,
      date: '2025-12-15',
      status: 'completed',
      method: 'M-Pesa',
      mpesaCode: 'SAF7K4L5M6',
      phone: '0723456789',
      month: 'December 2025'
    },
  ];

  // Filter contributions
  const filteredContributions = contributions.filter((contrib) => {
    const matchesSearch = contrib.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contrib.mpesaCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || contrib.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalAmount = contributions
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.amount, 0);
  
  const completedCount = contributions.filter(c => c.status === 'completed').length;
  const pendingCount = contributions.filter(c => c.status === 'pending').length;
  const lateCount = contributions.filter(c => c.status === 'late').length;

  const statusColors = {
    completed: 'bg-secondary/10 text-secondary border-secondary/20',
    pending: 'bg-accent/10 text-accent border-accent/20',
    late: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const statusIcons = {
    completed: <CheckCircle2 className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    late: <XCircle className="w-4 h-4" />
  };

  const handleViewDetails = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setShowDetails(true);
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
            <h1 className="text-2xl font-bold">Contributions</h1>
            <p className="text-sm text-muted-foreground">Track all member contributions</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold text-secondary">KSh {totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-accent">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-destructive">{lateCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by member name or M-Pesa code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('completed')}
                className={selectedFilter === 'completed' ? 'bg-secondary hover:bg-secondary/90' : ''}
              >
                Completed
              </Button>
              <Button
                variant={selectedFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('pending')}
                className={selectedFilter === 'pending' ? 'bg-accent hover:bg-accent/90' : ''}
              >
                Pending
              </Button>
              <Button
                variant={selectedFilter === 'late' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('late')}
                className={selectedFilter === 'late' ? 'bg-destructive hover:bg-destructive/90' : ''}
              >
                Late
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contributions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution History</CardTitle>
          <CardDescription>All contributions from all members</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredContributions.map((contribution) => (
                  <tr key={contribution.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{contribution.memberName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">KSh {contribution.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(contribution.date).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-normal">
                        {contribution.method}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={`${statusColors[contribution.status]} font-normal`}>
                        <span className="flex items-center gap-1">
                          {statusIcons[contribution.status]}
                          {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                        </span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(contribution)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredContributions.map((contribution) => (
              <Card key={contribution.id} className="border">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{contribution.memberName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(contribution.date).toLocaleDateString('en-KE')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${statusColors[contribution.status]} font-normal`}>
                        {statusIcons[contribution.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-lg">KSh {contribution.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Method</p>
                        <Badge variant="outline" className="font-normal mt-1">
                          {contribution.method}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewDetails(contribution)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContributions.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No contributions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contribution Details</DialogTitle>
            <DialogDescription>Complete information about this contribution</DialogDescription>
          </DialogHeader>
          {selectedContribution && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedContribution.memberName}</p>
                  <p className="text-sm text-muted-foreground">{selectedContribution.month}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="font-bold text-lg">KSh {selectedContribution.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline" className={`${statusColors[selectedContribution.status]} font-normal`}>
                    <span className="flex items-center gap-1">
                      {statusIcons[selectedContribution.status]}
                      {selectedContribution.status.charAt(0).toUpperCase() + selectedContribution.status.slice(1)}
                    </span>
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {new Date(selectedContribution.date).toLocaleDateString('en-KE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <Badge variant="outline" className="font-normal">
                  {selectedContribution.method}
                </Badge>
              </div>

              {selectedContribution.mpesaCode && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">M-Pesa Code</p>
                  <p className="font-mono font-medium bg-muted px-3 py-2 rounded">
                    {selectedContribution.mpesaCode}
                  </p>
                </div>
              )}

              {selectedContribution.phone && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {selectedContribution.phone}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                {role === 'admin' && selectedContribution.status === 'pending' && (
                  <Button className="flex-1 bg-secondary hover:bg-secondary/90">
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

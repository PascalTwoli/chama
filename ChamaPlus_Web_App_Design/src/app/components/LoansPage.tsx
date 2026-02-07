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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Plus,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Calendar,
  User,
  Percent,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

interface LoansPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

interface Loan {
  id: string;
  borrower: string;
  amount: number;
  interestRate: number;
  duration: number; // in months
  purpose: string;
  status: 'active' | 'completed' | 'defaulted';
  disbursedDate: string;
  dueDate: string;
  amountPaid: number;
  nextPayment: number;
  nextPaymentDate: string;
}

export default function LoansPage({ onBack, role }: LoansPageProps) {
  const [showIssueLoan, setShowIssueLoan] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [newLoan, setNewLoan] = useState({
    borrower: '',
    amount: '',
    interestRate: '5',
    duration: '12',
    purpose: '',
    autoDeduct: false,
  });

  // Mock data
  const loans: Loan[] = [
    {
      id: '1',
      borrower: 'Mary Wanjiku',
      amount: 50000,
      interestRate: 5,
      duration: 12,
      purpose: 'Small business expansion',
      status: 'active',
      disbursedDate: '2025-10-01',
      dueDate: '2026-10-01',
      amountPaid: 15000,
      nextPayment: 4583,
      nextPaymentDate: '2026-02-01',
    },
    {
      id: '2',
      borrower: 'Peter Ochieng',
      amount: 30000,
      interestRate: 5,
      duration: 6,
      purpose: 'Emergency medical expenses',
      status: 'active',
      disbursedDate: '2025-11-15',
      dueDate: '2026-05-15',
      amountPaid: 10000,
      nextPayment: 5250,
      nextPaymentDate: '2026-02-15',
    },
    {
      id: '3',
      borrower: 'Grace Akinyi',
      amount: 20000,
      interestRate: 5,
      duration: 12,
      purpose: 'Education fees',
      status: 'completed',
      disbursedDate: '2025-01-10',
      dueDate: '2026-01-10',
      amountPaid: 21000,
      nextPayment: 0,
      nextPaymentDate: '-',
    },
    {
      id: '4',
      borrower: 'David Mwangi',
      amount: 40000,
      interestRate: 5,
      duration: 12,
      purpose: 'Home improvement',
      status: 'active',
      disbursedDate: '2025-09-01',
      dueDate: '2026-09-01',
      amountPaid: 20000,
      nextPayment: 3667,
      nextPaymentDate: '2026-02-01',
    },
  ];

  const members = [
    'Mary Wanjiku',
    'Peter Ochieng',
    'Grace Akinyi',
    'David Mwangi',
    'Sarah Njeri',
    'John Kamau',
    'James Omondi',
    'Anne Chebet',
    'Paul Kiptoo',
    'Lucy Muthoni',
  ];

  // Calculate statistics
  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalRepaid = loans.reduce((sum, loan) => sum + loan.amountPaid, 0);
  const activeLoans = loans.filter(l => l.status === 'active').length;
  const outstandingBalance = totalLoaned - totalRepaid;

  const statusColors = {
    active: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-secondary/10 text-secondary border-secondary/20',
    defaulted: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const statusIcons = {
    active: <Clock className="w-4 h-4" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
    defaulted: <AlertCircle className="w-4 h-4" />,
  };

  const handleIssueLoan = () => {
    if (!newLoan.borrower || !newLoan.amount || !newLoan.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Loan issued successfully!');
    setShowIssueLoan(false);
    setNewLoan({
      borrower: '',
      amount: '',
      interestRate: '5',
      duration: '12',
      purpose: '',
      autoDeduct: false,
    });
  };

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
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
            <h1 className="text-2xl font-bold">Member Loans</h1>
            <p className="text-sm text-muted-foreground">
              Manage loans from group savings
            </p>
          </div>
        </div>
        {role === 'admin' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowIssueLoan(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Issue Loan
            </Button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Loaned</p>
                <p className="text-2xl font-bold">
                  KSh {totalLoaned.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Repaid</p>
                <p className="text-2xl font-bold text-secondary">
                  KSh {totalRepaid.toLocaleString()}
                </p>
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
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-bold">{activeLoans}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-destructive">
                  KSh {outstandingBalance.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loans Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Loans</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="defaulted">Defaulted</TabsTrigger>
        </TabsList>

        {['all', 'active', 'completed', 'defaulted'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {tab === 'all'
                    ? 'All Loans'
                    : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Loans`}
                </CardTitle>
                <CardDescription>
                  {tab === 'all'
                    ? 'Complete loan portfolio'
                    : `Loans with ${tab} status`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Borrower
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Progress
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Next Payment
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans
                        .filter(loan => tab === 'all' || loan.status === tab)
                        .map(loan => (
                          <tr
                            key={loan.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{loan.borrower}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {loan.purpose}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold">
                                KSh {loan.amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {loan.interestRate}% interest
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Repaid:
                                  </span>
                                  <span className="font-medium">
                                    KSh {loan.amountPaid.toLocaleString()}
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-secondary h-2 rounded-full"
                                    style={{
                                      width: `${Math.min((loan.amountPaid / (loan.amount * (1 + loan.interestRate / 100))) * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {loan.status === 'active' ? (
                                <div>
                                  <p className="font-medium">
                                    KSh {loan.nextPayment.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      loan.nextPaymentDate
                                    ).toLocaleDateString('en-KE', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-muted-foreground">-</p>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className={statusColors[loan.status]}
                              >
                                <span className="flex items-center gap-1">
                                  {statusIcons[loan.status]}
                                  {loan.status.charAt(0).toUpperCase() +
                                    loan.status.slice(1)}
                                </span>
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(loan)}
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
                  {loans
                    .filter(loan => tab === 'all' || loan.status === tab)
                    .map(loan => (
                      <Card key={loan.id} className="border">
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                  <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{loan.borrower}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {loan.purpose}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={statusColors[loan.status]}
                              >
                                {statusIcons[loan.status]}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Loan Amount
                                </p>
                                <p className="font-bold text-lg">
                                  KSh {loan.amount.toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  Repaid
                                </p>
                                <p className="font-bold text-lg text-secondary">
                                  KSh {loan.amountPaid.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-secondary h-2 rounded-full"
                                style={{
                                  width: `${Math.min((loan.amountPaid / (loan.amount * (1 + loan.interestRate / 100))) * 100, 100)}%`,
                                }}
                              />
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleViewDetails(loan)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Issue Loan Dialog */}
      <Dialog open={showIssueLoan} onOpenChange={setShowIssueLoan}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Issue New Loan</DialogTitle>
            <DialogDescription>
              Disburse a loan from group savings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Borrower *
              </label>
              <Select
                value={newLoan.borrower}
                onValueChange={value =>
                  setNewLoan({ ...newLoan, borrower: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Loan Amount (KSh) *
              </label>
              <Input
                type="number"
                placeholder="0"
                value={newLoan.amount}
                onChange={e =>
                  setNewLoan({ ...newLoan, amount: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Interest Rate (%) *
              </label>
              <Input
                type="number"
                placeholder="5"
                value={newLoan.interestRate}
                onChange={e =>
                  setNewLoan({ ...newLoan, interestRate: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Annual interest rate
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Repayment Duration (Months) *
              </label>
              <Select
                value={newLoan.duration}
                onValueChange={value =>
                  setNewLoan({ ...newLoan, duration: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Purpose *
              </label>
              <Input
                placeholder="e.g., Business expansion"
                value={newLoan.purpose}
                onChange={e =>
                  setNewLoan({ ...newLoan, purpose: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <input
                type="checkbox"
                id="autoDeduct"
                checked={newLoan.autoDeduct}
                onChange={e =>
                  setNewLoan({ ...newLoan, autoDeduct: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="autoDeduct" className="text-sm flex-1">
                Auto-deduct repayments from future contributions
              </label>
            </div>

            {newLoan.amount && newLoan.duration && (
              <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                <p className="text-sm font-medium">Loan Summary</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Principal:</span>
                    <span className="font-medium">
                      KSh {parseFloat(newLoan.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Interest ({newLoan.interestRate}%):
                    </span>
                    <span className="font-medium">
                      KSh{' '}
                      {(
                        (parseFloat(newLoan.amount) *
                          parseFloat(newLoan.interestRate)) /
                        100
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-medium">Total Repayment:</span>
                    <span className="font-bold">
                      KSh{' '}
                      {(
                        parseFloat(newLoan.amount) *
                        (1 + parseFloat(newLoan.interestRate) / 100)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monthly Payment:
                    </span>
                    <span className="font-medium">
                      KSh{' '}
                      {(
                        (parseFloat(newLoan.amount) *
                          (1 + parseFloat(newLoan.interestRate) / 100)) /
                        parseFloat(newLoan.duration)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIssueLoan(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleIssueLoan}
            >
              Issue Loan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loan Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>Complete loan information</DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedLoan.borrower}</p>
                  <Badge
                    variant="outline"
                    className={`${statusColors[selectedLoan.status]} mt-1`}
                  >
                    <span className="flex items-center gap-1">
                      {statusIcons[selectedLoan.status]}
                      {selectedLoan.status.charAt(0).toUpperCase() +
                        selectedLoan.status.slice(1)}
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Loan Amount
                  </p>
                  <p className="font-bold text-lg">
                    KSh {selectedLoan.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Interest Rate
                  </p>
                  <p className="font-bold text-lg flex items-center gap-1">
                    <Percent className="w-4 h-4" />
                    {selectedLoan.interestRate}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Purpose</p>
                <p className="font-medium">{selectedLoan.purpose}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Disbursed Date
                  </p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(selectedLoan.disbursedDate).toLocaleDateString(
                      'en-KE',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(selectedLoan.dueDate).toLocaleDateString(
                      'en-KE',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-medium">Repayment Progress</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-bold text-secondary">
                      KSh {selectedLoan.amountPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Due:</span>
                    <span className="font-bold">
                      KSh{' '}
                      {(
                        selectedLoan.amount *
                        (1 + selectedLoan.interestRate / 100)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-bold text-destructive">
                      KSh{' '}
                      {(
                        selectedLoan.amount *
                          (1 + selectedLoan.interestRate / 100) -
                        selectedLoan.amountPaid
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-background rounded-full h-2 mt-2">
                  <div
                    className="bg-secondary h-2 rounded-full"
                    style={{
                      width: `${Math.min((selectedLoan.amountPaid / (selectedLoan.amount * (1 + selectedLoan.interestRate / 100))) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {selectedLoan.status === 'active' && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium mb-2">Next Payment</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">
                        KSh {selectedLoan.nextPayment.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Due{' '}
                        {new Date(
                          selectedLoan.nextPaymentDate
                        ).toLocaleDateString('en-KE', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {role === 'admin' && (
                      <Button
                        size="sm"
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        Record Payment
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </Button>
                {role === 'admin' && selectedLoan.status === 'active' && (
                  <Button variant="outline" className="flex-1">
                    Edit Terms
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

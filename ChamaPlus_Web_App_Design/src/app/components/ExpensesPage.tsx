import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ArrowLeft, 
  Plus,
  Download,
  Filter,
  Search,
  Receipt,
  TrendingDown,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  DollarSign
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

interface ExpensesPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'reimbursement' | 'purchase' | 'investment' | 'administrative' | 'welfare' | 'other';
  date: string;
  approvedBy: string;
  paidTo: string;
  receipt?: string;
  notes?: string;
}

export default function ExpensesPage({ onBack, role }: ExpensesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'purchase' as Expense['category'],
    paidTo: '',
    notes: ''
  });

  // Mock data
  const expenses: Expense[] = [
    {
      id: '1',
      description: 'Meeting venue rental',
      amount: 5000,
      category: 'administrative',
      date: '2026-01-15',
      approvedBy: 'John Kamau',
      paidTo: 'Safari Park Hotel',
      receipt: 'RCP-2026-001'
    },
    {
      id: '2',
      description: 'Member welfare - Medical assistance',
      amount: 15000,
      category: 'welfare',
      date: '2026-01-12',
      approvedBy: 'Mary Wanjiku',
      paidTo: 'Grace Akinyi',
      notes: 'Emergency medical support'
    },
    {
      id: '3',
      description: 'Treasury bond investment',
      amount: 200000,
      category: 'investment',
      date: '2026-01-10',
      approvedBy: 'John Kamau',
      paidTo: 'Central Bank of Kenya'
    },
    {
      id: '4',
      description: 'Stationery and printing',
      amount: 2500,
      category: 'purchase',
      date: '2026-01-08',
      approvedBy: 'Mary Wanjiku',
      paidTo: 'City Stationers',
      receipt: 'RCP-2026-002'
    },
    {
      id: '5',
      description: 'Transport reimbursement',
      amount: 1500,
      category: 'reimbursement',
      date: '2026-01-05',
      approvedBy: 'John Kamau',
      paidTo: 'Peter Ochieng',
      notes: 'Collection of member documents'
    }
  ];

  const categoryColors: Record<string, string> = {
    reimbursement: 'bg-blue-50 text-blue-700 border-blue-200',
    purchase: 'bg-purple-50 text-purple-700 border-purple-200',
    investment: 'bg-secondary/10 text-secondary border-secondary/20',
    administrative: 'bg-accent/10 text-accent border-accent/20',
    welfare: 'bg-pink-50 text-pink-700 border-pink-200',
    other: 'bg-muted text-muted-foreground border-border'
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.paidTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthExpenses = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);
  
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.paidTo) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Expense recorded successfully!');
    setShowAddExpense(false);
    setNewExpense({
      description: '',
      amount: '',
      category: 'purchase',
      paidTo: '',
      notes: ''
    });
  };

  const handleViewDetails = (expense: Expense) => {
    setSelectedExpense(expense);
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
            <h1 className="text-2xl font-bold">Expense Tracking</h1>
            <p className="text-sm text-muted-foreground">Track and manage Chama expenses</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddExpense(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Record Expense
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-destructive">KSh {totalExpenses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">KSh {thisMonthExpenses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investments</p>
                <p className="text-2xl font-bold text-secondary">KSh {(expensesByCategory.investment || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{expenses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="reimbursement">Reimbursement</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="welfare">Welfare</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>All recorded Chama expenses</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Paid To</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        {expense.receipt && (
                          <p className="text-xs text-muted-foreground">{expense.receipt}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-destructive">-KSh {expense.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={categoryColors[expense.category]}>
                        {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{expense.paidTo}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(expense)}
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
            {filteredExpenses.map((expense) => (
              <Card key={expense.id} className="border">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(expense.date).toLocaleDateString('en-KE')}
                        </p>
                      </div>
                      <Badge variant="outline" className={categoryColors[expense.category]}>
                        {expense.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-lg text-destructive">-KSh {expense.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Paid To</p>
                        <p className="font-medium">{expense.paidTo}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewDetails(expense)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No expenses found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record New Expense</DialogTitle>
            <DialogDescription>Add a new expense to the Chama records</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <Input
                placeholder="e.g., Meeting venue rental"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Amount (KSh) *</label>
              <Input
                type="number"
                placeholder="0"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category *</label>
              <Select value={newExpense.category} onValueChange={(value: any) => setNewExpense({...newExpense, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reimbursement">Reimbursement</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="welfare">Welfare</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Paid To *</label>
              <Input
                placeholder="e.g., Safari Park Hotel"
                value={newExpense.paidTo}
                onChange={(e) => setNewExpense({...newExpense, paidTo: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
                placeholder="Additional details..."
                value={newExpense.notes}
                onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExpense(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleAddExpense}>
              Record Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>Complete information about this expense</DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p className="text-2xl font-bold text-destructive">-KSh {selectedExpense.amount.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline" className={categoryColors[selectedExpense.category]}>
                    {selectedExpense.category.charAt(0).toUpperCase() + selectedExpense.category.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">
                    {new Date(selectedExpense.date).toLocaleDateString('en-KE', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="font-medium">{selectedExpense.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Paid To</p>
                <p className="font-medium">{selectedExpense.paidTo}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Approved By</p>
                <p className="font-medium">{selectedExpense.approvedBy}</p>
              </div>

              {selectedExpense.receipt && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Receipt Number</p>
                  <p className="font-mono font-medium bg-muted px-3 py-2 rounded">
                    {selectedExpense.receipt}
                  </p>
                </div>
              )}

              {selectedExpense.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedExpense.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
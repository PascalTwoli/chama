import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface RecordContributionProps {
  onBack: () => void;
}

export default function RecordContribution({ onBack }: RecordContributionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [mpesaRef, setMpesaRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const members = [
    { id: 1, name: 'Mary Wanjiku', phone: '0712345678', status: 'paid', lastPayment: 'Jan 5, 2026' },
    { id: 2, name: 'Peter Kamau', phone: '0723456789', status: 'paid', lastPayment: 'Jan 5, 2026' },
    { id: 3, name: 'Grace Achieng', phone: '0734567890', status: 'paid', lastPayment: 'Jan 6, 2026' },
    { id: 4, name: 'David Omondi', phone: '0745678901', status: 'pending', lastPayment: 'Dec 5, 2025' },
    { id: 5, name: 'Faith Njeri', phone: '0756789012', status: 'paid', lastPayment: 'Jan 5, 2026' },
    { id: 6, name: 'John Mwangi', phone: '0767890123', status: 'pending', lastPayment: 'Dec 5, 2025' },
    { id: 7, name: 'Sarah Wambui', phone: '0778901234', status: 'paid', lastPayment: 'Jan 7, 2026' },
    { id: 8, name: 'James Otieno', phone: '0789012345', status: 'pending', lastPayment: 'Dec 5, 2025' },
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !amount || !mpesaRef) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Contribution recorded successfully!');
    // Reset form
    setSelectedMember(null);
    setAmount('');
    setMpesaRef('');
  };

  const selectedMemberData = members.find(m => m.id === selectedMember);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Record Contribution</h1>
          <p className="text-sm text-muted-foreground">Add new M-Pesa payment record</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Member</CardTitle>
            <CardDescription>Search and select the member who made the payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Members List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    selectedMember === member.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-bold text-primary text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          member.status === 'paid'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }
                      >
                        {member.status === 'paid' ? 'Paid This Month' : 'Pending'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">Last: {member.lastPayment}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter M-Pesa transaction info</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedMemberData && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">Recording for:</p>
                  <p className="font-bold text-primary">{selectedMemberData.name}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm">
                  Amount (KSh) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="amount"
                    type="number"
                    placeholder="5000"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="mpesaRef" className="text-sm">
                  M-Pesa Reference *
                </label>
                <input
                  id="mpesaRef"
                  type="text"
                  placeholder="QBX7H2K9LM"
                  className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                  value={mpesaRef}
                  onChange={(e) => setMpesaRef(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="paymentDate" className="text-sm">
                  Payment Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="paymentDate"
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!selectedMember}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

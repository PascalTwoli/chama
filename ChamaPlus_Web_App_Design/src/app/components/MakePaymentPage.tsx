import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, CreditCard, Phone, Building, CheckCircle2, Info, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface MakePaymentPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

export default function MakePaymentPage({ onBack, role }: MakePaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank' | 'card'>('mpesa');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast.success(`Payment of KSh ${parseFloat(amount).toLocaleString()} initiated successfully!`);
      setAmount('');
      setPhoneNumber('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Make Payment</h1>
          <p className="text-sm text-muted-foreground">Contribute to your Chama savings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>Choose how you want to make your contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 rounded-lg border-2 transition-all ${ 
                    paymentMethod === 'mpesa'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-lg ${paymentMethod === 'mpesa' ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center`}>
                      <Phone className={`w-6 h-6 ${paymentMethod === 'mpesa' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">M-Pesa</p>
                      <p className="text-xs text-muted-foreground">Mobile Money</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-lg ${paymentMethod === 'bank' ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center`}>
                      <Building className={`w-6 h-6 ${paymentMethod === 'bank' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">Direct Transfer</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-lg ${paymentMethod === 'card' ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center`}>
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Card Payment</p>
                      <p className="text-xs text-muted-foreground">Debit/Credit</p>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter the amount and {paymentMethod === 'mpesa' ? 'phone number' : 'payment details'}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                {/* Amount */}
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount (KSh) *
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="amount"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="5000"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* M-Pesa Payment */}
                {paymentMethod === 'mpesa' && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        M-Pesa Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="phone"
                          type="tel"
                          placeholder="0712345678"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You'll receive an STK push prompt on this number
                      </p>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-primary mt-0.5" />
                        <div className="text-sm text-primary">
                          <p className="font-medium mb-1">How it works:</p>
                          <ol className="list-decimal list-inside space-y-1 text-xs">
                            <li>Enter your M-Pesa registered phone number</li>
                            <li>Click "Pay Now" to initiate payment</li>
                            <li>Enter your M-Pesa PIN when prompted</li>
                            <li>You'll receive a confirmation SMS</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Bank Transfer */}
                {paymentMethod === 'bank' && (
                  <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-3">
                    <p className="font-medium">Bank Account Details:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bank Name:</span>
                        <span className="font-medium">Equity Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Name:</span>
                        <span className="font-medium">Tumaini Chama</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="font-medium">0123456789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Branch:</span>
                        <span className="font-medium">Nairobi Branch</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      After transferring, please notify the admin with your transaction reference
                    </p>
                  </div>
                )}

                {/* Card Payment */}
                {paymentMethod === 'card' && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="cardNumber" className="text-sm font-medium">
                        Card Number *
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="expiry" className="text-sm font-medium">
                          Expiry Date *
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="cvv" className="text-sm font-medium">
                          CVV *
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={processing}
                >
                  {processing ? 'Processing...' : paymentMethod === 'bank' ? 'Notify Admin' : 'Pay Now'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Chama</p>
                <p className="font-medium">Tumaini Chama</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Total Savings</p>
                <p className="text-2xl font-bold">KSh 85,000</p>
              </div>
              {amount && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">New Total After Payment</p>
                  <p className="text-2xl font-bold text-primary">
                    KSh {(85000 + parseFloat(amount)).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: 'Jan 5, 2026', amount: 5000 },
                { date: 'Dec 5, 2025', amount: 5000 },
                { date: 'Nov 5, 2025', amount: 5000 },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium">{payment.date}</p>
                    <p className="text-xs text-muted-foreground">M-Pesa</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">KSh {payment.amount.toLocaleString()}</p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

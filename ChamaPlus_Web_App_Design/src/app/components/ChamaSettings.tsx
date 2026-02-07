import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Save, CheckCircle2, Info, FileText, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ChamaSettingsProps {
  onBack: () => void;
}

export default function ChamaSettings({ onBack }: ChamaSettingsProps) {
  const [chamaName, setChamaName] = useState('Tumaini Chama');
  const [contributionModel, setContributionModel] = useState<'fixed' | 'flexible'>('fixed');
  const [fixedAmount, setFixedAmount] = useState('5000');
  const [contributionFrequency, setContributionFrequency] = useState('monthly');
  const [contributionDay, setContributionDay] = useState('5');
  const [minimumContribution, setMinimumContribution] = useState('');
  const [latePaymentGraceDays, setLatePaymentGraceDays] = useState('3');
  const [lateFee, setLateFee] = useState('100');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Chama settings saved successfully!');
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
          <h1 className="text-2xl font-bold">Chama Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your Chama rules and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>General Chama details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="chamaName" className="text-sm font-medium">
                    Chama Name *
                  </label>
                  <input
                    id="chamaName"
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={chamaName}
                    onChange={(e) => setChamaName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    placeholder="Tell members about your Chama's purpose and goals..."
                    className="w-full px-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contribution Model */}
            <Card>
              <CardHeader>
                <CardTitle>Contribution Model</CardTitle>
                <CardDescription>Choose how members contribute to your Chama</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Model Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setContributionModel('fixed')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      contributionModel === 'fixed'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          borderColor: contributionModel === 'fixed' ? '#2F7CF7' : '#e0e0e0',
                          backgroundColor: contributionModel === 'fixed' ? '#2F7CF7' : 'transparent'
                        }}
                      >
                        {contributionModel === 'fixed' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Fixed Contributions</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Members contribute the same amount at regular intervals (e.g., KSh 5,000 monthly)
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContributionModel('flexible')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      contributionModel === 'flexible'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          borderColor: contributionModel === 'flexible' ? '#2F7CF7' : '#e0e0e0',
                          backgroundColor: contributionModel === 'flexible' ? '#2F7CF7' : 'transparent'
                        }}
                      >
                        {contributionModel === 'flexible' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Flexible Contributions</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Members can contribute any amount at any time
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Fixed Model Settings */}
                {contributionModel === 'fixed' && (
                  <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm text-primary">
                        Fixed contribution model: All members contribute the same amount on a regular schedule
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="fixedAmount" className="text-sm font-medium">
                          Contribution Amount (KSh) *
                        </label>
                        <input
                          id="fixedAmount"
                          type="number"
                          placeholder="5000"
                          className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                          value={fixedAmount}
                          onChange={(e) => setFixedAmount(e.target.value)}
                          required={contributionModel === 'fixed'}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="frequency" className="text-sm font-medium">
                          Frequency *
                        </label>
                        <select
                          id="frequency"
                          className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                          value={contributionFrequency}
                          onChange={(e) => setContributionFrequency(e.target.value)}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contributionDay" className="text-sm font-medium">
                        Due Day of {contributionFrequency === 'monthly' ? 'Month' : contributionFrequency === 'weekly' ? 'Week' : 'Quarter'} *
                      </label>
                      <input
                        id="contributionDay"
                        type="number"
                        min="1"
                        max={contributionFrequency === 'monthly' ? '31' : contributionFrequency === 'weekly' ? '7' : '90'}
                        placeholder="5"
                        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        value={contributionDay}
                        onChange={(e) => setContributionDay(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {contributionFrequency === 'monthly' ? 'Day 1-31 (e.g., 5th of each month)' : 
                         contributionFrequency === 'weekly' ? 'Day 1-7 (1=Monday, 7=Sunday)' :
                         'Day 1-90 of the quarter'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="graceDays" className="text-sm font-medium">
                          Grace Period (Days)
                        </label>
                        <input
                          id="graceDays"
                          type="number"
                          min="0"
                          placeholder="3"
                          className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                          value={latePaymentGraceDays}
                          onChange={(e) => setLatePaymentGraceDays(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="lateFee" className="text-sm font-medium">
                          Late Payment Fee (KSh)
                        </label>
                        <input
                          id="lateFee"
                          type="number"
                          min="0"
                          placeholder="100"
                          className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                          value={lateFee}
                          onChange={(e) => setLateFee(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Flexible Model Settings */}
                {contributionModel === 'flexible' && (
                  <div className="space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-accent mt-0.5" />
                      <p className="text-sm text-accent">
                        Flexible contribution model: Members can contribute any amount whenever they want
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="minContribution" className="text-sm font-medium">
                        Minimum Contribution per Transaction (KSh) - Optional
                      </label>
                      <input
                        id="minContribution"
                        type="number"
                        min="0"
                        placeholder="e.g., 100 (leave empty for no minimum)"
                        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        value={minimumContribution}
                        onChange={(e) => setMinimumContribution(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Set a minimum amount per contribution, or leave empty to allow any amount
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium">Contribution Guidelines (Optional)</p>
                      <textarea
                        placeholder="e.g., 'Members are encouraged to contribute at least KSh 1,000 monthly' or 'Contribute what you can, when you can'"
                        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Share guidance with members about expected contribution patterns
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Rules</CardTitle>
                <CardDescription>Optional Chama regulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="requireMeetingAttendance"
                      className="w-4 h-4 mt-1 text-primary"
                      defaultChecked
                    />
                    <div>
                      <label htmlFor="requireMeetingAttendance" className="text-sm font-medium">
                        Require meeting attendance
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Members must attend monthly meetings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="allowLoans"
                      className="w-4 h-4 mt-1 text-primary"
                    />
                    <div>
                      <label htmlFor="allowLoans" className="text-sm font-medium">
                        Enable member loans
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Members can borrow from the group savings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="autoReminders"
                      className="w-4 h-4 mt-1 text-primary"
                      defaultChecked
                    />
                    <div>
                      <label htmlFor="autoReminders" className="text-sm font-medium">
                        Automatic SMS reminders
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Send payment reminders to members
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Onboarding Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Member Onboarding Templates</CardTitle>
                <CardDescription>Pre-filled templates for new member communications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {/* Welcome Message Template */}
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Welcome Message</h3>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`Welcome to ${chamaName}! We're excited to have you join our savings group. Our goal is to support each other financially and grow together. Contributions are ${contributionModel === 'fixed' ? `KSh ${fixedAmount} ${contributionFrequency}` : 'flexible - contribute what you can, when you can'}. Feel free to reach out if you have any questions!`);
                          toast.success('Welcome message copied to clipboard!');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Welcome to {chamaName}! We're excited to have you join our savings group. Our goal is to support each other financially and grow together. Contributions are {contributionModel === 'fixed' ? `KSh ${fixedAmount} ${contributionFrequency}` : 'flexible - contribute what you can, when you can'}. Feel free to reach out if you have any questions!
                    </p>
                  </div>

                  {/* Chama Rules Template */}
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Chama Rules</h3>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const rules = contributionModel === 'fixed' 
                            ? `${chamaName} Rules:\\n1. Members contribute KSh ${fixedAmount} every ${contributionFrequency}\\n2. Contributions due on day ${contributionDay} of each ${contributionFrequency === 'monthly' ? 'month' : contributionFrequency}\\n3. Grace period: ${latePaymentGraceDays} days\\n4. Late fee: KSh ${lateFee}\\n5. Attend all monthly meetings\\n6. Respect fellow members\\n7. All decisions made democratically`
                            : `${chamaName} Rules:\\n1. Members contribute flexibly based on ability\\n${minimumContribution ? `2. Minimum per transaction: KSh ${minimumContribution}` : '2. No minimum contribution'}\\n3. Attend all monthly meetings\\n4. Respect fellow members\\n5. All decisions made democratically\\n6. Support each other's financial goals`;
                          navigator.clipboard.writeText(rules);
                          toast.success('Chama rules copied to clipboard!');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>1. Members contribute {contributionModel === 'fixed' ? `KSh ${fixedAmount} every ${contributionFrequency}` : 'flexibly based on ability'}</p>
                      {contributionModel === 'fixed' && (
                        <>
                          <p>2. Contributions due on day {contributionDay} of each {contributionFrequency === 'monthly' ? 'month' : contributionFrequency}</p>
                          <p>3. Grace period: {latePaymentGraceDays} days, Late fee: KSh {lateFee}</p>
                        </>
                      )}
                      {contributionModel === 'flexible' && minimumContribution && (
                        <p>2. Minimum per transaction: KSh {minimumContribution}</p>
                      )}
                      <p>{contributionModel === 'fixed' ? '4' : minimumContribution ? '3' : '2'}. Attend all monthly meetings</p>
                      <p>{contributionModel === 'fixed' ? '5' : minimumContribution ? '4' : '3'}. All decisions made democratically</p>
                    </div>
                  </div>

                  {/* Contribution Guidelines Template */}
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Contribution Guidelines</h3>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const guidelines = contributionModel === 'fixed'
                            ? `How to Contribute to ${chamaName}:\\n• Amount: KSh ${fixedAmount}\\n• Frequency: ${contributionFrequency}\\n• Due: Day ${contributionDay} of each ${contributionFrequency === 'monthly' ? 'month' : contributionFrequency}\\n• Payment via M-Pesa to Chama account\\n• Grace period: ${latePaymentGraceDays} days\\n• Late fee after grace period: KSh ${lateFee}\\n• Keep your M-Pesa receipts\\n• Confirm payment with the treasurer`
                            : `How to Contribute to ${chamaName}:\\n• Contribute any amount, anytime\\n${minimumContribution ? `• Minimum per transaction: KSh ${minimumContribution}` : '• No minimum amount required'}\\n• Payment via M-Pesa to Chama account\\n• Keep your M-Pesa receipts\\n• Confirm payment with the treasurer\\n• Regular contributions help the group grow`;
                          navigator.clipboard.writeText(guidelines);
                          toast.success('Contribution guidelines copied to clipboard!');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>How to Contribute:</p>
                      {contributionModel === 'fixed' ? (
                        <>
                          <p>• Amount: KSh {fixedAmount}</p>
                          <p>• Frequency: {contributionFrequency}</p>
                          <p>• Due: Day {contributionDay}</p>
                        </>
                      ) : (
                        <>
                          <p>• Contribute any amount, anytime</p>
                          {minimumContribution && <p>• Minimum: KSh {minimumContribution}</p>}
                        </>
                      )}
                      <p>• Payment via M-Pesa</p>
                      <p>• Keep your M-Pesa receipts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Current Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Chama Name</p>
                  <p className="font-medium">{chamaName || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contribution Model</p>
                  <Badge variant="outline" className="mt-1">
                    {contributionModel === 'fixed' ? 'Fixed Contributions' : 'Flexible Contributions'}
                  </Badge>
                </div>
                {contributionModel === 'fixed' && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount & Frequency</p>
                      <p className="font-medium">
                        KSh {fixedAmount || '0'} / {contributionFrequency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Day</p>
                      <p className="font-medium">
                        Day {contributionDay || '0'} of {contributionFrequency === 'monthly' ? 'month' : contributionFrequency}
                      </p>
                    </div>
                  </>
                )}
                {contributionModel === 'flexible' && minimumContribution && (
                  <div>
                    <p className="text-sm text-muted-foreground">Minimum per Transaction</p>
                    <p className="font-medium">KSh {minimumContribution}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Choose Your Model</p>
                    <p className="text-xs text-muted-foreground">
                      Select based on how your Chama operates
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Fixed is Structured</p>
                    <p className="text-xs text-muted-foreground">
                      Good for traditional table banking
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Flexible is Open</p>
                    <p className="text-xs text-muted-foreground">
                      Perfect for savings groups with varying incomes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Save,
  CheckCircle2,
  Info,
  FileText,
  Copy,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function SettingsPage() {
  const [contributionModel, setContributionModel] = useState<
    'Fixed' | 'Flexible'
  >('Fixed');

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Chama Settings'
        subtitle='Configure your Chama rules and preferences'
      />

      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          {/* Basic Information */}
          <Card>
            <CardContent className='p-0'>
              <div className='p-6 pb-4 border-b border-border'>
                <h3 className='font-semibold text-lg'>Basic Information</h3>
                <p className='text-sm text-muted-foreground'>
                  General Chama details
                </p>
              </div>
              <div className='p-6 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='chamaName'>Chama Name *</Label>
                  <Input id='chamaName' defaultValue='Tumaini Chama' />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Description (Optional)</Label>
                  <textarea
                    id='description'
                    className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    placeholder="Tell members about your Chama's purpose and goals..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Model */}
          <Card>
            <CardContent className='p-6 space-y-6'>
              <div>
                <h3 className='font-semibold text-lg'>Contribution Model</h3>
                <p className='text-sm text-muted-foreground'>
                  Choose how members contribute to your Chama
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div
                  className={cn(
                    'border rounded-lg p-4 cursor-pointer transition-all flex items-start gap-3',
                    contributionModel === 'Fixed'
                      ? 'border-primary ring-1 ring-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  )}
                  onClick={() => setContributionModel('Fixed')}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border border-primary mt-1 flex items-center justify-center',
                      contributionModel === 'Fixed' && 'bg-primary'
                    )}
                  >
                    {contributionModel === 'Fixed' && (
                      <div className='w-2 h-2 rounded-full bg-primary-foreground' />
                    )}
                  </div>
                  <div>
                    <p className='font-medium'>Fixed Contributions</p>
                    <p className='text-xs text-muted-foreground'>
                      Members contribute the same amount at regular intervals
                      (e.g., KSh 5,000 monthly)
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'border rounded-lg p-4 cursor-pointer transition-all flex items-start gap-3',
                    contributionModel === 'Flexible'
                      ? 'border-primary ring-1 ring-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  )}
                  onClick={() => setContributionModel('Flexible')}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border border-primary mt-1 flex items-center justify-center',
                      contributionModel === 'Flexible' && 'bg-primary'
                    )}
                  >
                    {contributionModel === 'Flexible' && (
                      <div className='w-2 h-2 rounded-full bg-primary-foreground' />
                    )}
                  </div>
                  <div>
                    <p className='font-medium'>Flexible Contributions</p>
                    <p className='text-xs text-muted-foreground'>
                      Members can contribute any amount at any time
                    </p>
                  </div>
                </div>
              </div>

              {contributionModel === 'Fixed' && (
                <div className='space-y-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-lg'>
                  <div className='flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400'>
                    <Info className='w-4 h-4' />
                    Fixed contribution model: All members contribute the same
                    amount on a regular schedule
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Contribution Amount (KSh) *</Label>
                      <Input defaultValue='5000' />
                    </div>
                    <div className='space-y-2'>
                      <Label>Frequency *</Label>
                      <select className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                        <option>Monthly</option>
                        <option>Weekly</option>
                        <option>Quarterly</option>
                      </select>
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>Due Day of Month *</Label>
                      <Input defaultValue='5' />
                      <p className='text-[10px] text-muted-foreground'>
                        Day 1-31 (e.g., 5th of each month)
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <Label>Grace Period (Days)</Label>
                      <Input defaultValue='3' />
                    </div>
                    <div className='space-y-2'>
                      <Label>Late Payment Fee (KSh)</Label>
                      <Input defaultValue='100' />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Rules */}
          <Card>
            <CardContent className='p-6 space-y-4'>
              <h3 className='font-semibold text-lg'>Additional Rules</h3>
              <p className='text-sm text-muted-foreground'>
                Optional Chama regulations
              </p>

              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <input
                    type='checkbox'
                    id='attendance'
                    defaultChecked
                    className='h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                  />
                  <div className='space-y-1'>
                    <Label htmlFor='attendance' className='font-medium'>
                      Require meeting attendance
                    </Label>
                    <p className='text-xs text-muted-foreground'>
                      Members must attend monthly meetings
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <input
                    type='checkbox'
                    id='loans'
                    className='h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                  />
                  <div className='space-y-1'>
                    <Label htmlFor='loans' className='font-medium'>
                      Enable member loans
                    </Label>
                    <p className='text-xs text-muted-foreground'>
                      Members can borrow from the group savings
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <input
                    type='checkbox'
                    id='sms'
                    defaultChecked
                    className='h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                  />
                  <div className='space-y-1'>
                    <Label htmlFor='sms' className='font-medium'>
                      Automatic SMS reminders
                    </Label>
                    <p className='text-xs text-muted-foreground'>
                      Send payment reminders to members
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Templates */}
          <Card>
            <CardContent className='p-6 space-y-4'>
              <h3 className='font-semibold text-lg'>
                Member Onboarding Templates
              </h3>
              <p className='text-sm text-muted-foreground'>
                Pre-filled templates for new member communications
              </p>

              <div className='space-y-3'>
                {[
                  {
                    title: 'Welcome Message',
                    icon: FileText,
                    content:
                      "Welcome to Tumaini Chama! We're excited to have you...",
                  },
                  {
                    title: 'Chama Rules',
                    icon: FileText,
                    content: '1. Members contribute KSh 5000 every monthly...',
                  },
                  {
                    title: 'Contribution Guidelines',
                    icon: FileText,
                    content: 'How to Contribute: Amount: KSh 5000...',
                  },
                ].map((template, i) => (
                  <div
                    key={i}
                    className='border rounded-lg p-4 space-y-2 bg-muted/20'
                  >
                    <div className='flex justify-between items-start'>
                      <div className='flex items-center gap-2 font-medium text-sm'>
                        <template.icon className='w-4 h-4 text-blue-600' />
                        {template.title}
                      </div>
                      <Button variant='ghost' size='icon' className='h-6 w-6'>
                        <Copy className='w-3 h-3' />
                      </Button>
                    </div>
                    <p className='text-xs text-muted-foreground line-clamp-2'>
                      {template.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='w-full lg:w-80 space-y-6'>
          {/* Current Config */}
          <Card>
            <CardContent className='p-6 space-y-4'>
              <h3 className='font-semibold text-sm'>Current Configuration</h3>

              <div className='space-y-3'>
                <div>
                  <p className='text-xs text-muted-foreground'>Chama Name</p>
                  <p className='font-medium text-sm'>Tumaini Chama</p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Contribution Model
                  </p>
                  <Badge variant='secondary' className='mt-1 text-xs'>
                    Fixed Contributions
                  </Badge>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Amount & Frequency
                  </p>
                  <p className='font-medium text-sm'>KSh 5000 / monthly</p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Due Day</p>
                  <p className='font-medium text-sm'>Day 5 of month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardContent className='p-6 space-y-4'>
              <h3 className='font-semibold text-sm'>Help</h3>

              <div className='space-y-3'>
                <div className='flex gap-2 items-start'>
                  <CheckCircle2 className='w-4 h-4 text-blue-600 shrink-0' />
                  <div className='space-y-0.5'>
                    <p className='text-xs font-medium'>Choose Your Model</p>
                    <p className='text-[10px] text-muted-foreground'>
                      Select based on how your Chama operates
                    </p>
                  </div>
                </div>
                <div className='flex gap-2 items-start'>
                  <CheckCircle2 className='w-4 h-4 text-blue-600 shrink-0' />
                  <div className='space-y-0.5'>
                    <p className='text-xs font-medium'>Fixed is Structured</p>
                    <p className='text-[10px] text-muted-foreground'>
                      Good for traditional table banking
                    </p>
                  </div>
                </div>
                <div className='flex gap-2 items-start'>
                  <CheckCircle2 className='w-4 h-4 text-blue-600 shrink-0' />
                  <div className='space-y-0.5'>
                    <p className='text-xs font-medium'>Flexible is Open</p>
                    <p className='text-[10px] text-muted-foreground'>
                      Perfect for savings groups with varying incomes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className='w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
            <Save className='w-4 h-4' />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

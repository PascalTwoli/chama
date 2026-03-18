import { useEffect, useMemo, useState, useCallback } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import CustomCheckbox from '../components/CustomCheckbox';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Save, CheckCircle2, Info, FileText, Copy } from 'lucide-react';
import { cn } from '../utils/cn';
import { useChamaId } from '../hooks/useChamaId';
import ChamaSettingsService, {
  ChamaSettings,
  ContributionFrequency,
  ContributionModel,
  CreateChamaSettingsDto,
} from '../services/chama/chama-settings-service';
import { toast } from 'react-toastify';
import isEqual from 'lodash.isequal'; // Add this import

export default function SettingsPage() {
  const {
    chamaId,
    chamaData,
    isLoading: isChamaLoading,
    error: chamaError,
  } = useChamaId();

  const defaultFormState = useMemo(
    () => ({
      contributionModel: 'FIXED' as ContributionModel,
      contributionAmount: 5000 as number | null,
      frequency: 'MONTHLY' as ContributionFrequency | null,
      dueDay: 5 as number | null,
      gracePeriodDays: 3 as number | null,
      latePaymentFee: 100 as number | null,
      minimumContribution: null as number | null,
      contributionGuidelines: null as string | null,
      requireMeetingAttendance: true,
      enableMemberLoans: false,
      automaticSmsReminders: true,
    }),
    []
  );

  const [form, setForm] = useState(defaultFormState);
  const [existingSettings, setExistingSettings] =
    useState<ChamaSettings | null>(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const contributionModelUi =
    form.contributionModel === 'FIXED' ? 'Fixed' : 'Flexible';

  const parseIntOrNull = (value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isNaN(parsed) ? null : parsed;
  };

  useEffect(() => {
    const load = async () => {
      if (!chamaId) return;
      setIsSettingsLoading(true);
      try {
        const settings = await ChamaSettingsService.getSettings(chamaId);
        setExistingSettings(settings);
        setForm({
          contributionModel: settings.contributionModel,
          contributionAmount: settings.contributionAmount,
          frequency: settings.frequency,
          dueDay: settings.dueDay,
          gracePeriodDays: settings.gracePeriodDays,
          latePaymentFee: settings.latePaymentFee,
          minimumContribution: settings.minimumContribution,
          contributionGuidelines: settings.contributionGuidelines,
          requireMeetingAttendance: settings.requireMeetingAttendance,
          enableMemberLoans: settings.enableMemberLoans,
          automaticSmsReminders: settings.automaticSmsReminders,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load settings';
        const status =
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { status?: unknown } }).response
            ?.status === 'number'
            ? (err as { response: { status: number } }).response.status
            : undefined;
        if (status === 404) {
          setExistingSettings(null);
          setForm(defaultFormState);
        } else {
          toast.error(message);
        }
      } finally {
        setIsSettingsLoading(false);
      }
    };

    load();
  }, [chamaId, defaultFormState]);

  const onSave = async () => {
    if (!chamaId) {
      toast.error('No chama selected');
      return;
    }

    setIsSaving(true);
    try {
      const payload: CreateChamaSettingsDto = {
        contributionModel: form.contributionModel,
        contributionAmount: form.contributionAmount ?? undefined,
        frequency: form.frequency ?? undefined,
        dueDay: form.dueDay ?? undefined,
        gracePeriodDays: form.gracePeriodDays ?? undefined,
        latePaymentFee: form.latePaymentFee ?? undefined,
        minimumContribution: form.minimumContribution ?? undefined,
        contributionGuidelines: form.contributionGuidelines ?? undefined,
        requireMeetingAttendance: form.requireMeetingAttendance,
        enableMemberLoans: form.enableMemberLoans,
        automaticSmsReminders: form.automaticSmsReminders,
      };

      const saved = existingSettings
        ? await ChamaSettingsService.updateSettings(chamaId, payload)
        : await ChamaSettingsService.createSettings(chamaId, payload);

      setExistingSettings(saved);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save settings'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to compare form with existing settings or default
  // Helper to normalize settings for comparison
  const normalizeSettings = useCallback(
    (settings: Partial<ChamaSettings> | typeof form) => ({
      contributionModel: settings.contributionModel ?? null,
      contributionAmount: settings.contributionAmount ?? null,
      frequency: settings.frequency ?? null,
      dueDay: settings.dueDay ?? null,
      gracePeriodDays: settings.gracePeriodDays ?? null,
      latePaymentFee: settings.latePaymentFee ?? null,
      minimumContribution: settings.minimumContribution ?? null,
      contributionGuidelines: settings.contributionGuidelines ?? null,
      requireMeetingAttendance: settings.requireMeetingAttendance ?? false,
      enableMemberLoans: settings.enableMemberLoans ?? false,
      automaticSmsReminders: settings.automaticSmsReminders ?? false,
    }),
    []
  );

  const isFormDirty = useMemo(() => {
    if (existingSettings) {
      return !isEqual(
        normalizeSettings(existingSettings),
        normalizeSettings(form)
      );
    }
    return !isEqual(
      normalizeSettings(form),
      normalizeSettings(defaultFormState)
    );
  }, [form, existingSettings, defaultFormState, normalizeSettings]);

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
                <h3 className='font-semibold text-lg m-0'>Basic Information</h3>
                <p className='text-sm text-muted-foreground m-0'>
                  General Chama details
                </p>
              </div>
              <div className='p-6 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='chamaName'>Chama Name *</Label>
                  <Input
                    id='chamaName'
                    value={chamaData?.name || ''}
                    disabled
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Description (Optional)</Label>
                  <textarea
                    id='description'
                    className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    placeholder="Tell members about your Chama's purpose and goals..."
                    value={chamaData?.description || ''}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Model */}
          <Card>
            <CardContent className='p-6 space-y-6'>
              <div>
                <h3 className='font-semibold text-lg m-0'>
                  Contribution Model
                </h3>
                <p className='text-sm text-muted-foreground m-0'>
                  Choose how members contribute to your Chama
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div
                  className={cn(
                    'border rounded-lg p-4 cursor-pointer transition-all flex items-start gap-3',
                    contributionModelUi === 'Fixed'
                      ? 'border-primary ring-1 ring-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  )}
                  onClick={() =>
                    setForm(prev => ({ ...prev, contributionModel: 'FIXED' }))
                  }
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border border-primary mt-1 flex items-center justify-center',
                      contributionModelUi === 'Fixed' && 'bg-primary'
                    )}
                  >
                    {contributionModelUi === 'Fixed' && (
                      <div className='w-2 h-2 rounded-full bg-primary-foreground' />
                    )}
                  </div>
                  <div>
                    <p className='font-medium m-0'>Fixed Contributions</p>
                    <p className='text-xs text-muted-foreground'>
                      Members contribute the same amount at regular intervals
                      (e.g., KSh 5,000 monthly)
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'border rounded-lg p-4 cursor-pointer transition-all flex items-start gap-3',
                    contributionModelUi === 'Flexible'
                      ? 'border-primary ring-1 ring-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  )}
                  onClick={() =>
                    setForm(prev => ({
                      ...prev,
                      contributionModel: 'FLEXIBLE',
                    }))
                  }
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border border-primary mt-1 flex items-center justify-center',
                      contributionModelUi === 'Flexible' && 'bg-primary'
                    )}
                  >
                    {contributionModelUi === 'Flexible' && (
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

              {contributionModelUi === 'Fixed' && (
                <div className='space-y-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-lg'>
                  <div className='flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400'>
                    <Info className='w-4 h-4' />
                    Fixed contribution model: All members contribute the same
                    amount on a regular schedule
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Contribution Amount (KSh) *</Label>
                      <Input
                        value={form.contributionAmount ?? ''}
                        onChange={e =>
                          setForm(prev => ({
                            ...prev,
                            contributionAmount: parseIntOrNull(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Frequency *</Label>
                      <select
                        value={form.frequency ?? ''}
                        onChange={e =>
                          setForm(prev => ({
                            ...prev,
                            frequency:
                              (e.target.value as ContributionFrequency) || null,
                          }))
                        }
                        className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <option value='MONTHLY'>Monthly</option>
                        <option value='WEEKLY'>Weekly</option>
                      </select>
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>Due Day of Month *</Label>
                      <Input
                        value={form.dueDay ?? ''}
                        onChange={e =>
                          setForm(prev => ({
                            ...prev,
                            dueDay: parseIntOrNull(e.target.value),
                          }))
                        }
                      />
                      <p className='text-[10px] text-muted-foreground'>
                        Day 1-31 (e.g., 5th of each month)
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <Label>Grace Period (Days)</Label>
                      <Input
                        value={form.gracePeriodDays ?? ''}
                        onChange={e =>
                          setForm(prev => ({
                            ...prev,
                            gracePeriodDays: parseIntOrNull(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Late Payment Fee (KSh)</Label>
                      <Input
                        value={form.latePaymentFee ?? ''}
                        onChange={e =>
                          setForm(prev => ({
                            ...prev,
                            latePaymentFee: parseIntOrNull(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {contributionModelUi === 'Flexible' && (
                <div className='space-y-4 p-4 bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900 rounded-lg'>
                  <div className='flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400'>
                    <Info className='w-4 h-4' />
                    Flexible contribution model: Members can contribute any
                    amount whenever they want
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>
                        Minimum Contribution per Transaction (KSh) - optional
                      </Label>
                      <Input
                        value={form.minimumContribution ?? ''}
                        onChange={e =>
                          setForm(prev => ({
                            ...prev,
                            minimumContribution: parseIntOrNull(e.target.value),
                          }))
                        }
                        placeholder='e.g., 100 (leave empty for no minimum)'
                      />
                      <p className='text-[10px] text-muted-foreground'>
                        Set a minimum amount per contribution, or leave empty to
                        allow any amount
                      </p>
                    </div>

                    <div className='space-y-2 md:col-span-2'>
                      <Label>Contribution Guidelines (Optional)</Label>
                      <textarea
                        className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        value={form.contributionGuidelines ?? ''}
                        onChange={e =>
                          setForm(prev => ({
                            ...prev,
                            contributionGuidelines: e.target.value,
                          }))
                        }
                        placeholder="e.g., 'Members are encouraged to contribute at least KSh 1,000 monthly' or 'Contribute what you can, when you can'"
                      />
                      <p className='text-[10px] text-muted-foreground'>
                        Share guidance with members about expected contribution
                        patterns
                      </p>
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
                  <CustomCheckbox
                    id='attendance'
                    checked={form.requireMeetingAttendance}
                    onChange={(checked: boolean) =>
                      setForm(prev => ({
                        ...prev,
                        requireMeetingAttendance: checked,
                      }))
                    }
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
                  <CustomCheckbox
                    id='loans'
                    checked={form.enableMemberLoans}
                    onChange={(checked: boolean) =>
                      setForm(prev => ({
                        ...prev,
                        enableMemberLoans: checked,
                      }))
                    }
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
                  <CustomCheckbox
                    id='sms'
                    checked={form.automaticSmsReminders}
                    onChange={(checked: boolean) =>
                      setForm(prev => ({
                        ...prev,
                        automaticSmsReminders: checked,
                      }))
                    }
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
                  <p className='text-xs text-muted-foreground m-0 mt-2'>
                    Chama Name
                  </p>
                  <p className='font-medium text-sm my-1'>
                    {chamaData?.name || '-'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground m-0 mt-2'>
                    Contribution Model
                  </p>
                  <Badge variant='secondary' className='text-xs my-1'>
                    {contributionModelUi === 'Fixed'
                      ? 'Fixed Contributions'
                      : 'Flexible Contributions'}
                  </Badge>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground m-0 mt-2'>
                    Amount & Frequency
                  </p>
                  {contributionModelUi === 'Fixed' ? (
                    <p className='font-medium text-sm my-1'>
                      {`KSh ${form.contributionAmount ?? '-'} / ${form.frequency ? form.frequency.toLowerCase() : '-'}`}
                    </p>
                  ) : (
                    <p className='font-medium text-sm'>Flexible</p>
                  )}
                </div>
                <div>
                  <p className='text-xs text-muted-foreground m-0 mt-2'>
                    Due Day
                  </p>
                  {contributionModelUi === 'Fixed' ? (
                    <p className='font-medium text-sm my-1'>
                      {form.dueDay ? `Day ${form.dueDay}` : '-'}
                    </p>
                  ) : (
                    <p className='font-medium text-sm'>-</p>
                  )}
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
                    <p className='text-xs font-medium m-0'>Choose Your Model</p>
                    <p className='text-[10px] text-muted-foreground'>
                      Select based on how your Chama operates
                    </p>
                  </div>
                </div>
                <div className='flex gap-2 items-start'>
                  <CheckCircle2 className='w-4 h-4 text-blue-600 shrink-0' />
                  <div className='space-y-0.5'>
                    <p className='text-xs font-medium m-0'>
                      Fixed is Structured
                    </p>
                    <p className='text-[10px] text-muted-foreground'>
                      Good for traditional table banking
                    </p>
                  </div>
                </div>
                <div className='flex gap-2 items-start'>
                  <CheckCircle2 className='w-4 h-4 text-blue-600 shrink-0' />
                  <div className='space-y-0.5'>
                    <p className='text-xs font-medium m-0'>Flexible is Open</p>
                    <p className='text-[10px] text-muted-foreground'>
                      Perfect for savings groups with varying incomes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            className={cn(
              'w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white',
              !isFormDirty &&
                'opacity-50 cursor-not-allowed pointer-events-none'
            )}
            onClick={onSave}
            disabled={
              !isFormDirty ||
              isSaving ||
              isSettingsLoading ||
              isChamaLoading ||
              !!chamaError ||
              !chamaId
            }
          >
            <Save className='w-4 h-4' />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

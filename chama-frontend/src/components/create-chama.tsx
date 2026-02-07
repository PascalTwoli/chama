import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExtendedChamaFormData } from '../models/chamas';
import ChamaService from '../services/chama/chama-services';
import { useChamaMembership } from '../context/ChamaMembershipContext';
import {
  ArrowLeft,
  Users,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

type ContributionModel = 'FIXED' | 'FLEXIBLE';

interface CreateChamaFormData {
  name: string;
  description: string;
  location: string;
  contributionModel: ContributionModel;
  meetingSchedule: string;
  membersCount: number;
  country: string;
  organizationRole: string;
  rules: string;
}

const CreateChama: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const navigate = useNavigate();
  const { refreshMemberships } = useChamaMembership();

  const [formData, setFormData] = useState<CreateChamaFormData>({
    name: '',
    description: '',
    location: '',
    contributionModel: 'FIXED',
    meetingSchedule: '',
    membersCount: 1,
    country: 'KENYA',
    organizationRole: 'CHAIRPERSON',
    rules: 'Standard chama rules apply.',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Chama name is required';
    if (!formData.description.trim())
      errors.description = 'Description is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const submitData: ExtendedChamaFormData = {
        name: formData.name,
        description: formData.description,
        membersCount: formData.membersCount,
        country: formData.country,
        organizationRole: formData.organizationRole,
        rules: formData.rules,
      };

      const response = await ChamaService.createNewChama(submitData);
      if (!response || !response.id) {
        throw new Error('No chama ID returned from server');
      }

      const chamaId = response.id;
      const chamaName = response.name || formData.name;

      localStorage.setItem('activeChamaId', chamaId);
      localStorage.setItem('hasCreatedChama', 'true');
      localStorage.setItem('userRole', 'ADMIN');

      await refreshMemberships();
      toast.success(`${chamaName} created successfully!`);

      navigate(`/admin/chamas/${chamaId}`, {
        state: { name: chamaName, chamaId: chamaId },
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create chama'
      );
      console.error('Error creating chama:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate('/onboarding/chama-choice');

  return (
    <div className='min-h-screen bg-background py-8 px-4'>
      <div className='max-w-[600px] mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <button
            type='button'
            onClick={handleCancel}
            className='flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors text-sm font-medium'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back</span>
          </button>
          <div className='w-px h-6 bg-border' />
          <div>
            <h1 className='text-xl font-bold text-foreground'>
              Create Your Chama
            </h1>
            <p className='text-sm text-muted-foreground'>
              Set up your savings group in minutes
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className='bg-card border border-border rounded-xl p-6 mb-4'>
            <h2 className='text-base font-semibold text-foreground mb-1'>
              Basic Information
            </h2>
            <p className='text-sm text-muted-foreground mb-5'>
              Tell us about your Chama
            </p>

            {/* Chama Name */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Chama Name <span className='text-destructive'>*</span>
              </label>
              <div className='relative'>
                <Users className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='e.g., Tumaini Chama'
                  className={`w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    validationErrors.name ? 'border-destructive' : ''
                  }`}
                />
              </div>
              {validationErrors.name && (
                <p className='mt-1 text-sm text-destructive'>
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Description <span className='text-destructive'>*</span>
              </label>
              <div className='relative'>
                <FileText className='absolute left-3 top-3 w-5 h-5 text-muted-foreground' />
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Describe the purpose and goals of your Chama'
                  rows={4}
                  className={`w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${
                    validationErrors.description ? 'border-destructive' : ''
                  }`}
                />
              </div>
              {validationErrors.description && (
                <p className='mt-1 text-sm text-destructive'>
                  {validationErrors.description}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Location <span className='text-destructive'>*</span>
              </label>
              <div className='relative'>
                <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <input
                  type='text'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder='e.g., Nairobi, Kenya'
                  className={`w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    validationErrors.location ? 'border-destructive' : ''
                  }`}
                />
              </div>
              {validationErrors.location && (
                <p className='mt-1 text-sm text-destructive'>
                  {validationErrors.location}
                </p>
              )}
            </div>
          </div>

          {/* Contribution Model */}
          <div className='bg-card border border-border rounded-xl p-6 mb-4'>
            <h2 className='text-base font-semibold text-foreground mb-1'>
              Contribution Model
            </h2>
            <p className='text-sm text-muted-foreground mb-5'>
              Choose how members will contribute
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Fixed */}
              <button
                type='button'
                onClick={() =>
                  setFormData(prev => ({ ...prev, contributionModel: 'FIXED' }))
                }
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  formData.contributionModel === 'FIXED'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50'
                }`}
              >
                <div className='w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3'>
                  <DollarSign className='w-5 h-5 text-foreground' />
                </div>
                <h3 className='font-semibold text-foreground mb-1'>
                  Fixed Contribution
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Members contribute a specific amount at specific times (e.g.,
                  monthly)
                </p>
              </button>

              {/* Flexible */}
              <button
                type='button'
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    contributionModel: 'FLEXIBLE',
                  }))
                }
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  formData.contributionModel === 'FLEXIBLE'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50'
                }`}
              >
                <div className='w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3'>
                  <DollarSign className='w-5 h-5 text-foreground' />
                </div>
                <h3 className='font-semibold text-foreground mb-1'>
                  Flexible Contribution
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Members can contribute any amount at any time
                </p>
              </button>
            </div>
          </div>

          {/* Meeting Schedule */}
          <div className='bg-card border border-border rounded-xl p-6 mb-4'>
            <h2 className='text-base font-semibold text-foreground mb-1'>
              Meeting Schedule
            </h2>
            <p className='text-sm text-muted-foreground mb-5'>
              When will your Chama meet?
            </p>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Meeting Schedule *
              </label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <input
                  type='text'
                  name='meetingSchedule'
                  value={formData.meetingSchedule}
                  onChange={handleInputChange}
                  placeholder='e.g., First Saturday of every month'
                  className='w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className='flex gap-4 mt-6'>
            <button
              type='button'
              onClick={handleCancel}
              disabled={isLoading}
              className='flex-1 py-3 px-6 bg-card border border-border rounded-lg text-foreground font-medium hover:bg-muted transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <svg
                    className='animate-spin h-5 w-5'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                'Create Chama'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChama;

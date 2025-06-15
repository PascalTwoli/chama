import React, { useState } from 'react';
import AuthService from '../services/auth/signup-service';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { ExtendedChamaFormData } from '../models/chamas';
import ChamaService from '../services/chama-services';

const tabs = ['Basic', 'Features', 'Terms'];

// Component for creating a new chama (for admin users)
const CreateChama: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ExtendedChamaFormData>({
    name: '',
    membersCount: 0,
    description: '',
    country: 'kenya',
    location: '',
    organizationRole: '',
    image: null,
    terms: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const input = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: input.files ? input.files[0] : null,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.name.trim()) {
          errors.chamaName = 'Organisation name is required';
        }
        if (!formData.membersCount || formData.membersCount <= 0) {
          errors.membersCount = 'Number of members must be greater than 0';
        }
        if (!formData.organizationRole) {
          errors.organizationRole = 'Organisation role is required';
        }
        if (!formData.country) {
          errors.country = 'Country is required';
        }
        break;

      case 2: // Terms
        if (!formData.terms.trim()) {
          errors.terms = 'Terms and conditions are required';
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setActiveStep(prev => prev - 1);
  };

  // Handle final form submission
  const handleSubmit = async () => {
    // Validate all required steps
    if (!validateStep(0) || !validateStep(2)) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare form data for API
      const submitData: ExtendedChamaFormData = {
        name: formData.name,
        description: formData.description,
        membersCount: formData.membersCount,
        country: formData.country,
        location: formData.location,
        organizationRole: formData.organizationRole,
        terms: formData.terms,
        image: formData.image,
      };

      // Make API call to create a chama
      const response = await ChamaService.createNewChama(submitData);

      // If your API returns a 'success' or 'status' property, check it here.
      // Adjust the property name as per your actual response type.
      if (
        !response ||
        (typeof response.success !== 'undefined' && !response.success)
      ) {
        throw new Error(response?.message || 'Failed to create chama');
      }

      // Use the response directly as data
      const data = response;

      // Mark chama creation as complete
      AuthService.markChamaCreationComplete(data.chamaId);

      // Redirect to admin dashboard
      navigate(`/admin/chamas/${data.chamaId}`, {
        state: { name: data.chama.name, chamaId: data.chamaId },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create chama. Please try again.'
      );
      console.error('Error creating chama:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className='bg-[#242E3B4D] p-3 pb-18 rounded-xl text-gray-500'>
            {' '}
            {/**bg-[#242E3B] */}
            <form onSubmit={handleSubmit} className='w-full'>
              {/* Basic Information Section */}
              <div className='flex flex-col gap-6'>
                <div className=''>
                  <div className='basic-info-cont  mb-4'>
                    <h4 className='m-0'>Basic Information</h4>
                    <p className='m-0 mb-2 text-sm'>
                      Set up the fundamental details of your chama
                    </p>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label htmlFor='chamaName' className='font-bold'>
                        Organisation Name{' '}
                        <span className='text-red-500'>*</span>
                        <input
                          type='text'
                          name='chamaName'
                          id='chamaName'
                          placeholder='Chama Name'
                          className={`p-2 rounded-md border bg-transparent text-white w-full outline-[#4084B9] focus:outline-2 ${
                            validationErrors.chamaName
                              ? 'border-red-500'
                              : 'border-[#525A644D]'
                          }`}
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        {validationErrors.chamaName && (
                          <p className='text-red-500 text-sm mt-1'>
                            {validationErrors.chamaName}
                          </p>
                        )}
                      </label>
                    </div>
                    <div>
                      <label htmlFor='numberOfMembers' className='font-bold'>
                        How many members in your organisation{' '}
                        <span className='text-red-500'>*</span>
                        <input
                          type='number'
                          name='membersCount'
                          placeholder='Number of Members'
                          className={`p-2 rounded border bg-transparent text-white w-full outline-[#4084B9] focus:outline-2 ${
                            validationErrors.membersCount
                              ? 'border-red-500'
                              : 'border-[#525A644D]'
                          }`}
                          id='numberOfMembers'
                          value={formData.membersCount || ''}
                          onChange={handleInputChange}
                          required
                        />
                        {validationErrors.membersCount && (
                          <p className='text-red-500 text-sm mt-1'>
                            {validationErrors.membersCount}
                          </p>
                        )}
                      </label>
                    </div>
                    <div>
                      <label htmlFor='organizationRole' className='font-bold'>
                        Your organisation role{' '}
                        <span className='text-red-500'>*</span>
                        <select
                          name='organizationRole'
                          id='organizationRole'
                          className={`p-2 rounded border bg-transparent text-white w-full outline-[#4084B9] focus:outline-2 ${
                            validationErrors.organizationRole
                              ? 'border-red-500'
                              : 'border-[#525A644D]'
                          }`}
                          value={formData.organizationRole}
                          onChange={handleInputChange}
                          required
                        >
                          <option value='' disabled>
                            --Select organisation role--
                          </option>
                          <option value='chair-person'>Chair person</option>
                          <option value='secretary'>Secretary</option>
                          <option value='treasurer'>Treasurer</option>
                          <option value='member'>Member</option>
                        </select>
                        {validationErrors.organizationRole && (
                          <p className='text-red-500 text-sm mt-1'>
                            {validationErrors.organizationRole}
                          </p>
                        )}
                      </label>
                    </div>
                    <div>
                      <label htmlFor='country' className='font-bold'>
                        Country of operation{' '}
                        <span className='text-red-500'>*</span>
                        <select
                          name='country'
                          id='country'
                          className={`p-2 rounded border bg-transparent text-white w-full outline-[#4084B9] focus:outline-2 ${
                            validationErrors.country
                              ? 'border-red-500'
                              : 'border-[#525A644D]'
                          }`}
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        >
                          <option value='kenya'>Kenya</option>
                          <option value='uganda'>Uganda</option>
                          <option value='tanzania'>Tanzania</option>
                          <option value='nigeria'>Nigeria</option>
                        </select>
                        {validationErrors.country && (
                          <p className='text-red-500 text-sm mt-1'>
                            {validationErrors.country}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className='font-bold'>
                      Description of the group
                    </label>
                    <textarea
                      name='description'
                      placeholder='Description of the Group'
                      className='p-2 rounded border border-[#525A644D] bg-transparent text-white w-full outline-[#4084B9] focus:outline-2'
                      id='chamaDescription'
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-2 text-gray-400'>
                  <i className='bi bi-image fs-1 text-7xl'></i>
                  <span>Upload an Image / Profile of the Chama</span>
                  <input
                    type='file'
                    name='image'
                    onChange={handleInputChange}
                    className='text-white'
                    accept='image/*'
                  />
                </div>
              </div>
            </form>
          </div>
        );
      case 1:
        return (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-14  bg-[#242E3B4D] p-8 pb-18 rounded-xl overflow-y-auto '>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div>
                <i className='bi bi-person-circle w-24'></i>
              </div>
              <div className='flex-1 '>
                <h4 className='m-0 font-bold'>Membership</h4>
                <p className='m-0'>Manage, add, remove and disable group...</p>
              </div>
            </div>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div>
                <i className='bi bi-pie-chart-fill'></i>
              </div>
              <div className='flex-1 '>
                <h4 className='m-0 font-bold'>Shares</h4>
                <p className='m-0'>Members are able to contribute towards...</p>
              </div>
            </div>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div>
                <i className='bi bi-snow3'></i>
              </div>
              <div className='flex-1 overflow-hidden'>
                <h4 className='m-0 font-bold'>Meetings</h4>
                <p className='m-0'>
                  Ability to manage meetings, have minutes...
                </p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='bg-[#242E3B4D] p-3 pb-18 rounded-xl text-white'>
            <div className='mb-4'>
              <h4 className='m-0 font-bold'>Terms and Conditions</h4>
              <p className='m-0 mb-4 text-sm text-gray-400'>
                Define the terms and conditions for your chama
              </p>
            </div>
            <div>
              <label
                htmlFor='chamaTerms'
                className='block text-sm font-medium text-gray-300 mb-2'
              >
                Chama Terms and Conditions{' '}
                <span className='text-red-500'>*</span>
              </label>
              <textarea
                name='terms'
                id='chamaTerms'
                placeholder='Please enter the terms and conditions for your chama here...'
                rows={8}
                required
                value={formData.terms}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  validationErrors.terms ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {validationErrors.terms && (
                <p className='text-red-500 text-sm mt-1'>
                  {validationErrors.terms}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='w-full max-h-full  p-8 pt-0 text-white px-40'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h2 className='text-lg font-bold m-0 '>Create a new Chama</h2>
          <p className='font-[200] m-0 text-sm'>
            Start your savings journey with a new chama group
          </p>
        </div>
        <button
          className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors h-[35px] rounded border-none'
          onClick={() => navigate('/chamas')}
        >
          <i className='bi bi-list '></i>
          <span className='ml-2'>My Chamas</span>
        </button>
      </div>

      {/* Tabs */}
      <div className='flex mb-6 justify-between gap-60'>
        {tabs.map((tab, index) => (
          <Button
            key={tab}
            className={`py-1 px-4 rounded flex-1 border-0 h-8  font-bold ${activeStep === index ? 'bg-[#4084B9] text-white' : 'bg-white text-gray-300'} hover:bg-[#4084B9] hover:text-white transition-colors`}
            onClick={() => setActiveStep(index)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Error Display */}
      {error && (
        <div className='bg-red-800 text-white p-3 rounded mt-4'>{error}</div>
      )}

      {/* Navigation Buttons */}
      <div className='flex justify-end gap-4 mt-6'>
        {activeStep > 0 && (
          <Button
            className='bg-[#4084B9] border-0'
            onClick={handlePrevious}
            disabled={isLoading}
          >
            Previous
          </Button>
        )}
        {activeStep < tabs.length - 1 && (
          <Button
            className='bg-[#4084B9] border-0'
            onClick={handleNext}
            disabled={isLoading}
          >
            Next
          </Button>
        )}
        {activeStep === tabs.length - 1 && (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={` py-3 px-4 border-none ${
              isLoading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
            } text-white rounded-md font-semibold transition-colors flex justify-center items-center`}
          >
            {isLoading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Creating Chama...
              </>
            ) : (
              'Create Chama'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateChama;

import { useNavigate } from 'react-router-dom';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import AuthService from '../services/auth/signup-service';
import { SignupRequest, FormErrors } from '../models/user';
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    } else if (newErrors.email) {
      newErrors.email = 'Email is already registered';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.signup(formData as SignupRequest);
      toast.success(
        'Registration successful! Redirecting to user type selection...'
      );

      // Redirect to user type selection page after short delay
      // This allows users to select their role in the system (e.g., admin, member, etc.)
      setTimeout(() => {
        navigate('/chose-user');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);

      // Check if error is related to email already existing
      if (
        error instanceof Error &&
        (error.message.includes('Email is already registered') ||
          (error.message.toLowerCase().includes('email') &&
            (error.message.toLowerCase().includes('exist') ||
              error.message.toLowerCase().includes('taken') ||
              error.message.toLowerCase().includes('already'))))
      ) {
        setErrors({
          ...errors,
          email: 'Email is already registered. Please use a different email.',
        });
        toast.error(
          'Email is already registered. Please use a different email or sign in.'
        );
      }
      // Check for validation errors
      else if (
        error instanceof Error &&
        error.message.includes('Validation error')
      ) {
        const fieldMatch = /field:\s*(\w+)/i.exec(error.message);
        if (fieldMatch && fieldMatch[1]) {
          const field = fieldMatch[1].toLowerCase();
          setErrors({
            ...errors,
            [field]: error.message.replace(/Validation error:\s*/i, ''),
          });
        }
        toast.error(error.message.replace(/Validation error:\s*/i, ''));
      }
      // Check for server errors
      else if (
        error instanceof Error &&
        (error.message.includes('internal server error') ||
          error.message.includes('Our team has been notified'))
      ) {
        toast.error(
          'An internal server error occurred. Please try again later.'
        );
      }
      // Check for network errors
      else if (
        error instanceof Error &&
        error.message.includes('Could not connect to the server')
      ) {
        toast.error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
        // setApiError("Email is already registered. Please use a different email or sign in.");
      }
      // For other errors
      else {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Registration failed. Please try again.'
        );
      }
    }
    setIsLoading(false);
  };

  return (
    <div className='bg-gray-900 flex justify-center min-h-screen items-center'>
      <div className='signin-container flex flex-row justify-center items-center rounded-xl'>
        <div className='signup-details flex items-center justify-center min-h-full bg-black '>
          <div className='w-full  px-10 rounded-xl font-bold overflow-y-auto h-[93vh] pt-2'>
            <form onSubmit={handleRegister}>
              <div className='flex gap-6'>
                <label htmlFor='firstName' className='w-full'>
                  First Name
                  <input
                    type='text'
                    id='firstName'
                    name='firstName'
                    placeholder='First Name'
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 focus:outline focus:outline-sky-500 ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.firstName}
                    </p>
                  )}
                </label>
                <label htmlFor='lastName' className='w-full'>
                  Last Name
                  <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    placeholder='Last Name'
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 focus:outline focus:outline-sky-500 ${
                      errors.lastName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.lastName && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.lastName}
                    </p>
                  )}
                </label>
              </div>
              <div className='mt-8'>
                <label htmlFor='email' className='w-full'>
                  Email address
                  <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-400 focus:outline focus:outline-sky-500 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
                  )}
                </label>
              </div>
              <div className='mt-8'>
                <label htmlFor='phoneNumber' className='w-full'>
                  Phone Number
                  <input
                    type='tel'
                    id='phoneNumber'
                    name='phoneNumber'
                    placeholder='Phone Number'
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 focus:outline focus:outline-sky-500 ${
                      errors.phoneNumber ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.phoneNumber}
                    </p>
                  )}
                </label>
              </div>
              <div className='mt-8 relative'>
                <label htmlFor='password' className='w-full'>
                  Password
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 focus:outline focus:outline-sky-500 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.password && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.password}
                    </p>
                  )}
                </label>
                <button
                  type='button'
                  className='absolute right-3 top-[36px] text-gray-400 hover:text-gray-200 transition duration-300 bg-transparent border-0 focus:outline-none'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <i className='bi bi-eye-slash text-2xl'></i>
                  ) : (
                    <i className='bi bi-eye text-2xl'></i>
                  )}
                </button>
              </div>
              <p className='text-gray-400 mt-8 font-normal'>
                By creating an account, you agree to our{' '}
                <button
                  onClick={() => {
                    /* TODO: Add terms page navigation */
                  }}
                  className='text-white bg-transparent border-0 p-0 cursor-pointer underline'
                >
                  Terms
                </button>{' '}
                and{' '}
                <button
                  onClick={() => {
                    /* TODO: Add privacy policy page navigation */
                  }}
                  className='text-white bg-transparent border-0 p-0 cursor-pointer underline'
                >
                  privacy policy
                </button>
              </p>
              <button
                type='submit'
                className='w-full p-2 mt-4 text-white bg-[#54B685] rounded hover:bg-green-400 transition duration-300 border-0 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer'
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              <div className='flex items-center my-6 mb-10 mt-14'>
                <div className='flex-grow  hor-line'></div>
                <button className=' google-login bg-gray-700 p-2 rounded flex justify-around items-center ml-4 mr-4 gap-4 hover:bg-gray-600 transition duration-300  border-0'>
                  <img
                    className='google-logo'
                    src='/assets/Google__G__logo.svg.webp'
                    alt='Google'
                  />
                  <span>Google Sign up</span>
                </button>
                <div className=' flex-grow hor-line'></div>
              </div>
            </form>

            <p className='mt-4 text-center text-gray-400 font-bold'>
              Already have an account?{' '}
              <a
                href='/signin'
                className='text-[#54B685] hover:text-green-400 transition duration-300'
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
        <div
          className='signup-image flex-1'
          style={{
            backgroundImage: "url('/assets/signinimage.png')",
            backgroundSize: 'cover',
          }}
        >
          <div className=' flex flex-col justify-center signup-image-overlay text-center p-14'>
            <p className='font-bold welcome-p mb-4 '>
              Welcome To <br />{' '}
              <span className='underline'>ChamaPlus System</span>
            </p>
            <p className='font-bold text-2xl p-7 pt-0 mt-0 text-center'>
              We provide easy-to-use tools for managing group finances and
              working together efficiently!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

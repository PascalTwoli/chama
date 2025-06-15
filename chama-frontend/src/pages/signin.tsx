import { FormEvent, useState, useEffect } from 'react';
import { FormErrors, SignInCredentials } from '../models/user'; //SignInResponse
import { AuthService as SigninService } from '../services/auth/signin-service';
import AuthService from '../services/auth/signup-service';
import { UserType } from '../data/user-type';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignInCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingUserType, setIsCheckingUserType] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error when user starts typing
    if (error[name]) {
      setError({
        ...error,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Sign in with credentials
      await SigninService.signIn(formData as SignInCredentials);

      // toast.success("Login successful! Checking account status...");

      // After successful login, check if user has a type
      setIsCheckingUserType(true);

      try {
        // Get user type from the backend API
        const activeUserType = await AuthService.getUserType();

        // Determine redirect path based on user type
        let redirectPath: string;
        let redirectMessage: string;

        if (!activeUserType) {
          // User has no type yet, redirect to select user type
          redirectPath = '/user-type';
          redirectMessage =
            'Login successful! Redirecting to select your role...';
        } else if (activeUserType === UserType.ADMIN) {
          // Admin user, redirect to admin dashboard
          redirectPath = '/admin/chamas/1';
          redirectMessage =
            'Login successful! Redirecting to admin dashboard...';
        } else if (activeUserType === UserType.MEMBER) {
          // Member user, redirect to chama list view
          redirectPath = '/chama-list-view';
          redirectMessage =
            'Login successful! Redirecting to member dashboard...';
        } else {
          // Fallback for unexpected user type
          redirectPath = '/chose-user';
          redirectMessage =
            'Login successful! Redirecting to verify your account...';
        }

        // Update success message
        toast.success(redirectMessage);

        // Navigate to the appropriate page
        setTimeout(() => {
          navigate(redirectPath);
        }, 3000);
      } catch (userTypeError) {
        console.error('Error checking user type:', userTypeError);
        // If there's an error getting the user type, redirect to user type selection
        toast.success('Login successful! Redirecting to account setup...');
        setTimeout(() => {
          navigate('/chose-user');
        }, 50000);
      } finally {
        setIsCheckingUserType(false);
      }
    } catch (error) {
      console.error('Login error:', error);

      // Check if the error is related to unregistered email
      if (
        error instanceof Error &&
        error.message.includes('unregistered email')
      ) {
        setError({
          email:
            'This email is not registered. Please sign up first or try again.',
        });
        // Show clean error without the prefix in the api error display
        toast.error(
          'This email is not registered. Please sign up first or try again.'
        );
      }
      // Check if the error is related to incorrect password
      else if (
        error instanceof Error &&
        error.message.includes('incorrect password')
      ) {
        setError({
          password: 'Incorrect password. Please try again.',
        });
        // Show clean error without the prefix in the api error display
        toast.error('The password you entered is incorrect. Please try again.');
      }
      // Check for network errors
      else if (error instanceof Error && error.message.includes('network')) {
        toast.error(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      }
      // Check for server errors
      else if (error instanceof Error && error.message.includes('server')) {
        // setApiError("An internal server error occurred. Please try again later.");
        toast.error(
          'This email is not registered. Please sign up first or try again.'
        );
      }
      // Check for rate limiting
      else if (error instanceof Error && error.message.includes('rate-limit')) {
        toast.error('Too many login attempts. Please try again later.');
      }
      // For any other errors, display the clean message
      else {
        // Extract clean error message by removing any prefixes
        const errorMessage =
          error instanceof Error
            ? 'Failed to sign in. Please check your credentials and try again.'
            : 'An unexpected error occurred. Please try again.';

        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gray-900 flex justify-center min-h-screen items-center'>
      <div className='signin-container flex flex-row justify-center items-center rounded-xl'>
        <div
          className='signin-image flex-1'
          style={{
            backgroundImage: "url('/assets/signinimage.png')",
            backgroundSize: 'cover',
          }}
        >
          <div className=' flex flex-col justify-center signin-image-overlay text-center p-14'>
            <p className='font-bold welcome-p mb-4'>
              Welcome Back To <br />{' '}
              <span className='underline'>ChamaPlus System</span>{' '}
            </p>
            <p className='font-bold text-2xl p-7 pt-0 mt-0 text-center'>
              We provide easy-to-use tools for managing group finances and
              working together efficiently!
            </p>
          </div>
        </div>
        <div className='signin-details flex items-center bg-black min-h-full flex-2 font-bold'>
          <div className='w-full p-10 min-h-full'>
            <form onSubmit={handleLogin}>
              <div className=''>
                <label className='email-input' htmlFor='email'>
                  E-mail Address
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete='email'
                    className={`w-full p-3 mt-4 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300 focus:outline focus:outline-sky-500 ${error.email ? 'border-red-500' : ''}`}
                    placeholder='example@gmail.com'
                  />
                  {error.email && (
                    <p className='text-red-500 text-sm mt-1'>{error.email}</p>
                  )}
                </label>
              </div>

              <div className='mt-20 relative'>
                <label className='pass-input' htmlFor='password'>
                  Password
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder='min 8 characters'
                    className={`w-full p-3 mt-4 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300 focus:outline focus:outline-sky-500 ${error.password ? 'border-red-500' : ''}`}
                  />
                  {error.password && (
                    <p className='text-red-500 text-sm mt-1'>
                      {error.password}
                    </p>
                  )}
                </label>
                <button
                  type='button'
                  className='absolute right-3 top-[45px] text-gray-400 hover:text-gray-200 transition duration-300 bg-transparent border-0 focus:outline-none'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <i className='bi bi-eye-slash text-2xl'></i>
                  ) : (
                    <i className='bi bi-eye text-2xl'></i>
                  )}
                </button>
                <div className='text-right'>
                  <a
                    href='/forgot-password'
                    className='font-bold text-[#54B685] hover:text-green-400 transition duration-300'
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className=''>
                <button
                  className='w-full p-2 mt-20 mb-10 text-white bg-[#54B685] rounded hover:bg-green-400 transition duration-300 border-0 text-center'
                  type='submit'
                  disabled={isLoading || isCheckingUserType}
                >
                  {isLoading
                    ? 'Signing in...'
                    : isCheckingUserType
                      ? 'Checking account...'
                      : 'Sign In'}
                </button>
              </div>

              <div className='flex items-center my-6 mb-10 mt-14'>
                <div className='flex-grow  hor-line'></div>
                <button className=' google-login bg-gray-700 p-2 rounded flex justify-around items-center ml-4 mr-4 gap-4 hover:bg-gray-600 transition duration-300  border-0'>
                  <img
                    className='google-logo'
                    src='/assets/Google__G__logo.svg.webp'
                    alt='Google'
                  />
                  <span>Sign In With Google</span>
                </button>
                <div className=' flex-grow hor-line'></div>
              </div>
            </form>

            <p className='mt-4 text-center text-gray-400 font-bold'>
              Don’t have an account?{' '}
              <a
                href='/signup'
                className='text-[#54B685] hover:text-green-400 transition duration-300'
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

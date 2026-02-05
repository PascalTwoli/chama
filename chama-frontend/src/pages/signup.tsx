import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthService from '../services/auth/signup-service';
import { SignupRequest, FormErrors } from '../models/user';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

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
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
        'Registration successful! Please create or join a chama to get started.'
      );
      setTimeout(() => {
        navigate('/onboarding/chama-choice');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);

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
      } else if (
        error instanceof Error &&
        error.message.includes('Could not connect')
      ) {
        toast.error(
          'Could not connect to the server. Please check your internet connection.'
        );
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Registration failed. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-secondary-light to-background'>
      <div className='w-full max-w-md'>
        {/* Logo & Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <div className='w-12 h-12 rounded-lg bg-primary flex items-center justify-center'>
              <Users className='w-7 h-7 text-primary-foreground' />
            </div>
          </div>
          <h2 className='text-2xl font-bold mb-2'>Create Account</h2>
          <p className='text-muted-foreground'>
            Join ChamaPlus to manage your savings group
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className='space-y-4'>
              {/* Name Row */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input
                    id='firstName'
                    name='firstName'
                    type='text'
                    placeholder='John'
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'border-destructive' : ''}
                    autoComplete='given-name'
                  />
                  {errors.firstName && (
                    <p className='text-destructive text-xs'>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName'>Last Name</Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    type='text'
                    placeholder='Doe'
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'border-destructive' : ''}
                    autoComplete='family-name'
                  />
                  {errors.lastName && (
                    <p className='text-destructive text-xs'>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='example@gmail.com'
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-destructive' : ''}
                  autoComplete='email'
                />
                {errors.email && (
                  <p className='text-destructive text-xs'>{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className='space-y-2'>
                <Label htmlFor='phoneNumber'>Phone Number</Label>
                <Input
                  id='phoneNumber'
                  name='phoneNumber'
                  type='tel'
                  placeholder='+254 712 345 678'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? 'border-destructive' : ''}
                  autoComplete='tel'
                />
                {errors.phoneNumber && (
                  <p className='text-destructive text-xs'>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Min 8 characters'
                    value={formData.password}
                    onChange={handleChange}
                    className={
                      errors.password ? 'border-destructive pr-10' : 'pr-10'
                    }
                    autoComplete='new-password'
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-destructive text-xs'>{errors.password}</p>
                )}
              </div>

              {/* Terms Text */}
              <p className='text-xs text-muted-foreground'>
                By creating an account, you agree to our{' '}
                <Link to='/terms' className='text-primary hover:underline'>
                  Terms
                </Link>{' '}
                and{' '}
                <Link to='/privacy' className='text-primary hover:underline'>
                  Privacy Policy
                </Link>
              </p>

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              {/* Divider */}
              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-border'></div>
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-card px-2 text-muted-foreground'>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign Up */}
              <Button variant='outline' className='w-full' type='button'>
                <img
                  src='/assets/Google__G__logo.svg.webp'
                  alt='Google'
                  className='w-5 h-5 mr-2'
                />
                Sign Up with Google
              </Button>
            </form>

            <p className='mt-6 text-center text-muted-foreground'>
              Already have an account?{' '}
              <Link
                to='/signin'
                className='text-primary hover:underline font-medium'
              >
                Sign In
              </Link>
            </p>
            <Button
              variant='ghost'
              className='w-full mt-4'
              onClick={() => navigate('/')}
            >
              Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;

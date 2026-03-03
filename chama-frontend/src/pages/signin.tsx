import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { FormErrors, SignInCredentials } from '../models/user';
import { AuthService as SigninService } from '../services/auth/signin-service';
import GoogleAuthService from '../services/auth/google-auth-service';
import ChamaService from '../services/chama/chama-services';
import { useChamaMembership } from '../context/ChamaMembershipContext';
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

const SignIn = () => {
  const navigate = useNavigate();
  const { refreshMemberships } = useChamaMembership();

  const [formData, setFormData] = useState<SignInCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingUserType, setIsCheckingUserType] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  // No longer using role selection - user goes directly to login form

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Sign in the user
      await SigninService.signIn(formData as SignInCredentials);
      await handlePostLogin();
    } catch (error) {
      console.error('Login error:', error);

      if (
        error instanceof Error &&
        error.message.includes('unregistered email')
      ) {
        setError({
          email: 'This email is not registered. Please sign up first.',
        });
        toast.error('This email is not registered. Please sign up first.');
      } else if (
        error instanceof Error &&
        error.message.includes('incorrect password')
      ) {
        setError({ password: 'Incorrect password. Please try again.' });
        toast.error('The password you entered is incorrect. Please try again.');
      } else if (error instanceof Error && error.message.includes('network')) {
        toast.error(
          'Could not connect to the server. Please check your internet connection.'
        );
      } else {
        toast.error(
          'Failed to sign in. Please check your credentials and try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await GoogleAuthService.signInWithGoogle();
      if (result) {
        if (result.isNewUser) {
          toast.success('Welcome! Please complete your profile.');
          // Redirect to onboarding/profile setup
          // You might want to create a specific route for this, e.g. /onboarding/profile
          // For now, sending to chama choice which triggers checks
          navigate('/onboarding/chama-choice');
        } else {
          toast.success('Google sign-in successful!');
          await handlePostLogin();
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      // Error is already toasted in the service
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostLogin = async () => {
    setIsCheckingUserType(true);

    try {
      // Check if user has any chamas
      const userChamas = await ChamaService.getUserChamas();

      if (userChamas && userChamas.length > 0) {
        // User has chamas - find the most recent or active one
        const activeChamaId = localStorage.getItem('activeChamaId');
        const lastDashboardContext =
          localStorage.getItem('lastDashboardContext') || 'admin';
        let targetChama = userChamas[0];

        if (activeChamaId) {
          const savedChama = userChamas.find(
            (chama: { id: string }) => chama.id === activeChamaId
          );
          if (savedChama) {
            targetChama = savedChama;
          }
        }

        // Store active chama
        localStorage.setItem('activeChamaId', targetChama.id);

        // Determine system role based on chama ownership or membership
        const roleUpperCase = targetChama.role?.toUpperCase() || '';
        const orgRoleUpperCase =
          targetChama.organizationRole?.toUpperCase() || '';

        // User has admin access if they're OWNER, ADMIN, or have governance roles
        const hasAdminAccess =
          roleUpperCase === 'OWNER' ||
          roleUpperCase === 'ADMIN' ||
          orgRoleUpperCase === 'CHAIRPERSON' ||
          orgRoleUpperCase === 'SECRETARY' ||
          orgRoleUpperCase === 'TREASURER';

        // Determine redirect path based on last context and admin access
        let redirectPath: string;
        if (hasAdminAccess && lastDashboardContext === 'admin') {
          // User has admin access and was last in admin view
          redirectPath = `/admin/chamas/${targetChama.id}`;
        } else if (hasAdminAccess && lastDashboardContext === 'member') {
          // User has admin access but was last in member view
          redirectPath = `/member/chamas/${targetChama.id}`;
        } else if (hasAdminAccess) {
          // User has admin access, default to admin dashboard for new sessions
          redirectPath = `/admin/chamas/${targetChama.id}`;
        } else {
          // Regular member - always go to member dashboard
          redirectPath = `/member/chamas/${targetChama.id}`;
        }

        toast.success(`Welcome back! Redirecting to ${targetChama.name}...`);

        // Refresh context BEFORE navigating to prevent race condition
        // This ensures guards see updated state when new route mounts
        await refreshMemberships();
        navigate(redirectPath);
      } else {
        // User has no chamas - redirect to chama choice
        toast.success('Login successful! Please create or join a chama.');
        await refreshMemberships();
        navigate('/onboarding/chama-choice');
      }
    } catch (chamaError) {
      console.error('Error fetching user chamas:', chamaError);
      // If we can't fetch chamas, redirect to chama choice
      toast.success('Login successful! Redirecting...');
      await refreshMemberships();
      navigate('/onboarding/chama-choice');
    } finally {
      setIsCheckingUserType(false);
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
          <h2 className='text-2xl font-bold mb-2'>Welcome Back</h2>
          <p className='text-muted-foreground'>Sign in to manage your Chama</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='example@gmail.com'
                  value={formData.email}
                  onChange={handleChange}
                  className={error.email ? 'border-destructive' : ''}
                  autoComplete='email'
                  required
                />
                {error.email && (
                  <p className='text-destructive text-sm'>{error.email}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={formData.password}
                    onChange={handleChange}
                    className={
                      error.password ? 'border-destructive pr-10' : 'pr-10'
                    }
                    required
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
                {error.password && (
                  <p className='text-destructive text-sm'>{error.password}</p>
                )}
              </div>

              <div className='text-right'>
                <Link
                  to='/forgot-password'
                  className='text-sm text-primary hover:underline'
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || isCheckingUserType}
              >
                {isLoading
                  ? 'Signing in...'
                  : isCheckingUserType
                    ? 'Checking account...'
                    : 'Sign In'}
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

              {/* Google Sign In */}
              <Button
                variant='outline'
                className='w-full'
                type='button'
                onClick={handleGoogleSignIn}
                disabled={isLoading || isCheckingUserType}
              >
                <img
                  src='/assets/Google__G__logo.svg.webp'
                  alt='Google'
                  className='w-5 h-5 mr-2'
                />
                Sign In with Google
              </Button>

              <Button
                variant='ghost'
                className='w-full'
                onClick={() => navigate('/')}
              >
                Back Home
              </Button>
            </form>

            <p className='mt-6 text-center text-muted-foreground'>
              {"Don't have an account? "}
              <Link
                to='/signup'
                className='text-primary hover:underline font-medium'
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;

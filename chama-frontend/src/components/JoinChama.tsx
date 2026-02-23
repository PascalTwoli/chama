import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  LogIn,
  UserPlus,
  Home,
  ArrowRight,
  Info,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface InviteDetails {
  chamaId: string;
  chama: {
    name: string;
    description?: string;
  };
  sentToEmail: string;
}

interface ChamaResponse {
  chamaId: string;
  chama: {
    name: string;
  };
}

function JoinChama() {
  const params = useParams<{ token?: string }>();
  const token = params.token || '';
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(
    null
  );

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    const validateInvite = async () => {
      try {
        const response = await axios.get<InviteDetails>(
          `/api/invites/validate/${token}`
        );
        setInviteDetails(response.data);

        if (isAuthenticated && user) {
          acceptInvite();
        } else {
          if (token) {
            sessionStorage.setItem('pendingInviteToken', token);
          }
          setLoading(false);
        }
      } catch (error: unknown) {
        console.error('Error validating invite:', error);
        setError(
          (error as ApiError).response?.data?.message ||
          'This invitation link is invalid or has expired.'
        );
        setLoading(false);
      }
    };

    validateInvite();
  }, [token, isAuthenticated, user]);

  const acceptInvite = async () => {
    try {
      setLoading(true);
      const response = await axios.post<ChamaResponse>(
        '/api/invites/accept',
        { token }
      );

      setSuccess(true);
      toast.success(
        `You have successfully joined ${response.data.chama.name}!`
      );

      setTimeout(() => {
        navigate(`/chama/${response.data.chamaId}`);
      }, 3000);
    } catch (error: unknown) {
      console.error('Error accepting invite:', error);
      setError(
        (error as ApiError).response?.data?.message ||
        'Failed to join chama. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    if (token) {
      sessionStorage.setItem('pendingInviteToken', token);
      navigate('/signin', { state: { returnUrl: `/join-chama/${token}` } });
    }
  };

  const handleSignupRedirect = () => {
    if (token) {
      sessionStorage.setItem('pendingInviteToken', token);
      navigate('/signup', { state: { returnUrl: `/join-chama/${token}` } });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
        <Loader2 className='w-12 h-12 animate-spin text-primary mb-4' />
        <p className='text-foreground'>Processing your invitation...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
        <div className='bg-card border border-border p-6 rounded-lg shadow-lg text-center max-w-md w-full'>
          <AlertTriangle className='w-16 h-16 text-accent mx-auto mb-4' />
          <h2 className='text-foreground text-2xl font-bold mb-4'>
            Invitation Error
          </h2>
          <p className='text-muted-foreground mb-6'>{error}</p>
          <Button onClick={() => navigate('/')} className='gap-2'>
            <Home className='w-4 h-4' />
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
        <div className='bg-card border border-border p-6 rounded-lg shadow-lg text-center max-w-md w-full'>
          <CheckCircle className='w-16 h-16 text-success mx-auto mb-4' />
          <h2 className='text-foreground text-2xl font-bold mb-4'>Success!</h2>
          <p className='text-muted-foreground mb-6'>
            You have successfully joined the chama. Redirecting you to the
            dashboard...
          </p>
          <Button
            variant='success'
            onClick={() => navigate(`/chama/${inviteDetails?.chamaId}`)}
            className='gap-2'
          >
            <ArrowRight className='w-4 h-4' />
            Go to Dashboard Now
          </Button>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
      <div className='bg-card border border-border p-6 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-foreground text-2xl font-bold mb-4 text-center'>
          Chama Invitation
        </h2>
        {inviteDetails && (
          <div className='mb-6'>
            <p className='text-muted-foreground mb-2'>
              You&apos;ve been invited to join:
            </p>
            <h3 className='text-foreground text-lg font-bold mb-4'>
              {inviteDetails.chama.name}
            </h3>
            <p className='text-muted-foreground mb-4'>
              This invitation was sent to:{' '}
              <span className='text-foreground font-semibold'>
                {inviteDetails.sentToEmail}
              </span>
            </p>
            <div className='bg-muted p-3 rounded-lg mb-4 flex items-start gap-2'>
              <Info className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
              <p className='text-muted-foreground text-sm'>
                You need to be logged in with the same email to accept this
                invitation.
              </p>
            </div>
          </div>
        )}

        <div className='flex flex-col gap-3'>
          <Button onClick={handleLoginRedirect} className='gap-2'>
            <LogIn className='w-4 h-4' />
            Sign In
          </Button>
          <div className='text-center text-muted-foreground my-2'>
            Don&apos;t have an account?
          </div>
          <Button
            variant='outline'
            onClick={handleSignupRedirect}
            className='gap-2'
          >
            <UserPlus className='w-4 h-4' />
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JoinChama;

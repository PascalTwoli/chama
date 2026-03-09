import { useEffect, useState, useRef } from 'react';
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
import { ChamaService } from '../services/chama/chama-services';
import { useAuth } from '../context/AuthContext';
import { useChamaMembership } from '../context/ChamaMembershipContext';
import SecureTokenStorage from '../utils/secure-token-storage';
import { Button } from './ui/button';

interface InviteDetails {
  chamaId: string;
  chama: {
    name: string;
    description?: string;
  };
  sentToEmail: string;
}

function JoinChama() {
  const params = useParams<{ token?: string }>();
  const token = params.token || '';
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, refreshAuth } = useAuth();
  const { refreshMemberships } = useChamaMembership();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(
    null
  );

  // Use refs to track across renders and prevent double execution
  const isProcessingRef = useRef(false);
  const hasAcceptedRef = useRef(false);

  // Check if user has auth token directly (handles race condition with React state)
  const hasAuthToken = SecureTokenStorage.isAuthenticated();

  useEffect(() => {
    // If no token, show error immediately
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Check if user is authenticated using direct token check
    const isUserAuthenticated = isAuthenticated || hasAuthToken;

    // If user has token but context not updated, refresh auth
    if (hasAuthToken && !isAuthenticated) {
      refreshAuth();
      return;
    }

    // Prevent double execution
    if (isProcessingRef.current) {
      return;
    }

    const processInvite = async () => {
      isProcessingRef.current = true;

      try {
        // Step 1: Validate the invite
        setLoading(true);
        const validationResponse = await ChamaService.validateInvite(token);

        const details: InviteDetails = {
          chamaId: validationResponse.chamaId,
          chama: {
            name: validationResponse.chama.name,
            description: validationResponse.chama.description,
          },
          sentToEmail: validationResponse.sentToEmail || '',
        };
        setInviteDetails(details);

        // Step 2: If not authenticated, show login options
        if (!isUserAuthenticated) {
          sessionStorage.setItem('pendingInviteToken', token);
          setLoading(false);
          isProcessingRef.current = false;
          return;
        }

        // Step 3: If authenticated and not already accepted, accept the invite
        if (hasAcceptedRef.current) {
          return;
        }
        hasAcceptedRef.current = true;

        try {
          const acceptResponse = await ChamaService.acceptInvite(token);

          // Clear the pending invite token
          sessionStorage.removeItem('pendingInviteToken');

          setSuccess(true);
          toast.success('You have successfully joined the chama!');

          // Refresh memberships
          await refreshMemberships();

          // Redirect to the chama dashboard
          setTimeout(() => {
            navigate(`/member/chamas/${acceptResponse.chamaId}`, {
              replace: true,
            });
          }, 2000);
        } catch (acceptError: unknown) {
          const errorMessage =
            acceptError instanceof Error
              ? acceptError.message
              : 'Failed to join chama.';

          // If already a member, just redirect
          if (
            errorMessage.toLowerCase().includes('already been used') ||
            errorMessage.toLowerCase().includes('already a member')
          ) {
            sessionStorage.removeItem('pendingInviteToken');
            toast.info('You are already a member of this chama!');
            await refreshMemberships();
            navigate(`/member/chamas/${details.chamaId}`, { replace: true });
            return;
          }

          setError(errorMessage);
          hasAcceptedRef.current = false; // Allow retry
        }
      } catch (validationError: unknown) {
        console.error('Error validating invite:', validationError);
        setError(
          validationError instanceof Error
            ? validationError.message
            : 'This invitation link is invalid or has expired.'
        );
        isProcessingRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    processInvite();
  }, [
    token,
    isAuthenticated,
    authLoading,
    hasAuthToken,
    refreshAuth,
    refreshMemberships,
    navigate,
  ]);

  const handleLoginRedirect = () => {
    if (token) {
      sessionStorage.setItem('pendingInviteToken', token);
      navigate('/auth/signin', {
        state: { returnUrl: `/join-chama/${token}` },
      });
    }
  };

  const handleSignupRedirect = () => {
    if (token) {
      sessionStorage.setItem('pendingInviteToken', token);
      navigate('/auth/signup', {
        state: { returnUrl: `/join-chama/${token}` },
      });
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
            onClick={() =>
              navigate(`/member/chamas/${inviteDetails?.chamaId}`, {
                replace: true,
              })
            }
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
            {inviteDetails.sentToEmail &&
              !inviteDetails.sentToEmail.includes('@placeholder.link') && (
                <>
                  <p className='text-muted-foreground mb-4'>
                    This invitation was sent to:{' '}
                    <span className='text-foreground font-semibold'>
                      {inviteDetails.sentToEmail}
                    </span>
                  </p>
                  <div className='bg-muted p-3 rounded-lg mb-4 flex items-start gap-2'>
                    <Info className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                    <p className='text-muted-foreground text-sm'>
                      You need to be logged in with the same email to accept
                      this invitation.
                    </p>
                  </div>
                </>
              )}
            {(!inviteDetails.sentToEmail ||
              inviteDetails.sentToEmail.includes('@placeholder.link')) && (
              <div className='bg-muted p-3 rounded-lg mb-4 flex items-start gap-2'>
                <Info className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                <p className='text-muted-foreground text-sm'>
                  Sign in or create an account to join this chama.
                </p>
              </div>
            )}
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

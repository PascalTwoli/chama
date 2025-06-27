import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface InviteDetails {
  chamaId: string;
  chamaName: string;
  invitedEmail: string;
}

interface ChamaResponse {
  chamaId: string;
  chama: {
    name: string;
  };
}

/**
 * Component for handling Chama invitation flow
 *
 * This component handles the following scenarios:
 * 1. User not logged in -> Redirect to login
 * 2. User logged in but incorrect email -> Show error
 * 3. User logged in with correct email -> Join chama
 * 4. Invalid or expired invite -> Show error
 * 5. Success -> Show success message and redirect to chama dashboard
 */
function JoinChama() {
  // Get token from params with type safety
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

  //apart from inviting a user, we also need to handle the case where a user is trying to join a chama
  // This component handles both inviting a user and joining a chama
  // for the case where a user is trying to join a chama, a request should just be sent to the admin of the chama who will then approve the request
  // and the user will be notified via email
  // This is done by checking if the user is authenticated and if the email matches the invited email
  // If the user is authenticated, we will try to accept the invite immediately
  // If the user is not authenticated, we will store the token in session storage and redirect to login/signup
  // This way, after the user logs in or signs up, we can check for any pending invites and process them
  // This is done using the useAuth context to check if the user is authenticated
  // and the user object to get the email of the authenticated user
  // We will also use the useEffect hook to check if the user is authenticated and process the invite accordingly
  // const isUserAuthenticated = useRef(isAuthenticated);
  // useEffect(() => {
  //   isUserAuthenticated.current = isAuthenticated;
  // }, [isAuthenticated]);

  // // If the user is authenticated, we can access the user object
  // const isUserEmailMatchingInvite = user?.email === inviteDetails?.invitedEmail;

  // Check authentication and process invite
  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    // First validate the token to get invite details
    const validateInvite = async () => {
      try {
        const response = await axios.get<InviteDetails>(
          `/api/invites/validate/${token}`
        );
        setInviteDetails(response.data);

        // If user is authenticated, try to accept the invite
        if (isAuthenticated && user) {
          acceptInvite();
        } else {
          // Store the token in session storage for post-login processing
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

  // Function to accept the invite
  const acceptInvite = async () => {
    try {
      setLoading(true);
      const response = await axios.post<ChamaResponse>(
        `/api/invites/accept/${token}`
      );

      setSuccess(true);
      toast.success(
        `You have successfully joined ${response.data.chama.name}!`
      );

      // Redirect to chama dashboard after a short delay
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

  // Function to handle redirect to login
  const handleLoginRedirect = () => {
    // Store the token to process after login
    if (token) {
      sessionStorage.setItem('pendingInviteToken', token);
      navigate('/signin', { state: { returnUrl: `/join-chama/${token}` } });
    }
  };

  // Function to handle redirect to signup
  const handleSignupRedirect = () => {
    // Store the token to process after signup
    if (token) {
      sessionStorage.setItem('pendingInviteToken', token);
      navigate('/signup', { state: { returnUrl: `/join-chama/${token}` } });
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className='flex flex-column align-items-center justify-content-center min-h-screen bg-gray-900 p-4'>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        <p className='text-white mt-3'>Processing your invitation...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className='flex flex-column align-items-center justify-content-center min-h-screen bg-gray-900 p-4'>
        <div className='bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md w-full'>
          <i className='pi pi-exclamation-triangle text-5xl text-yellow-500 mb-4'></i>
          <h2 className='text-white text-2xl font-bold mb-4'>
            Invitation Error
          </h2>
          <p className='text-gray-300 mb-6'>{error}</p>
          <div className='flex justify-content-center'>
            <Button
              label='Go to Dashboard'
              icon='pi pi-home'
              className='p-button-primary mr-2'
              onClick={() => navigate('/')}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render success state
  if (success) {
    return (
      <div className='flex flex-column align-items-center justify-content-center min-h-screen bg-gray-900 p-4'>
        <div className='bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md w-full'>
          <i className='pi pi-check-circle text-5xl text-green-500 mb-4'></i>
          <h2 className='text-white text-2xl font-bold mb-4'>Success!</h2>
          <p className='text-gray-300 mb-6'>
            You have successfully joined the chama. Redirecting you to the
            dashboard...
          </p>
          <div className='flex justify-content-center'>
            <Button
              label='Go to Dashboard Now'
              icon='pi pi-arrow-right'
              className='p-button-success'
              onClick={() => navigate(`/chama/${inviteDetails?.chamaId}`)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render unauthenticated state with invite details
  return (
    <div className='flex flex-column align-items-center justify-content-center min-h-screen bg-gray-900 p-4'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-white text-2xl font-bold mb-4 text-center'>
          Chama Invitation
        </h2>
        {inviteDetails && (
          <div className='mb-6'>
            <p className='text-gray-300 mb-2'>
              You&apos;ve been invited to join:
            </p>
            <h3 className='text-white text-lg font-bold mb-4'>
              {inviteDetails.chamaName}
            </h3>
            <p className='text-gray-300 mb-4'>
              This invitation was sent to:{' '}
              <span className='text-white font-semibold'>
                {inviteDetails.invitedEmail}
              </span>
            </p>
            <div className='bg-gray-700 p-3 rounded mb-4'>
              <p className='text-gray-300 text-sm'>
                <i className='pi pi-info-circle mr-2 text-blue-400'></i>
                You need to be logged in with the same email to accept this
                invitation.
              </p>
            </div>
          </div>
        )}

        <div className='flex flex-column gap-3'>
          <Button
            label='Sign In'
            icon='pi pi-sign-in'
            className='p-button-primary'
            onClick={handleLoginRedirect}
          />
          <div className='text-center text-gray-400 my-2'>
            Don&apos;t have an account?
          </div>
          <Button
            label='Create Account'
            icon='pi pi-user-plus'
            className='p-button-outlined p-button-secondary'
            onClick={handleSignupRedirect}
          />
        </div>
      </div>
    </div>
  );
}

export default JoinChama;

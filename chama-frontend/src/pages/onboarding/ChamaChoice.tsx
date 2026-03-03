import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Users,
  Search,
  MapPin,
  Calendar,
  User,
  Loader2,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useChamaMembership } from '../../context/ChamaMembershipContext';
import ChamaService from '../../services/chama/chama-services';
import { toast } from 'react-toastify';
import OnBoardingNavbar from '../../components/navbars/onboarding-navbar';

interface AvailableChama {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  totalSavings: number;
  location?: string;
  meetingSchedule?: string;
  contributionAmount?: number;
  admin?: string;
  status?: 'Fixed' | 'Flexible';
}

const ChamaChoice: React.FC = () => {
  const navigate = useNavigate();
  const { user, chamas, refreshMemberships } = useChamaMembership();
  const [availableChamas, setAvailableChamas] = useState<AvailableChama[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestingChamaId, setRequestingChamaId] = useState<string | null>(
    null
  );

  // Get pending requests from user's chamas
  const pendingRequests = chamas.filter(c => c.status === 'PENDING');

  useEffect(() => {
    const loadAvailableChamas = async () => {
      try {
        setIsLoading(true);
        const chamasData = await ChamaService.fetchAllChamas();
        // Map to AvailableChama format
        const mapped: AvailableChama[] = chamasData.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description,
          memberCount: c.memberCount ?? c.membersCount ?? 0,
          totalSavings: c.totalSavings ?? 0,
          location: c.location,
        }));
        setAvailableChamas(mapped);
      } catch (error) {
        console.error('Error loading chamas:', error);
        toast.error('Failed to load available chamas');
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableChamas();
  }, []);

  const handleCreateChama = () => {
    navigate('/onboarding/create-chama');
  };

  const handleRequestToJoin = async (chamaId: string) => {
    try {
      setRequestingChamaId(chamaId);
      await ChamaService.requestToJoinChama(chamaId, 'MEMBER', true);
      toast.success(
        'Join request sent successfully! Waiting for admin approval.'
      );
      await refreshMemberships();
    } catch (error) {
      console.error('Error requesting to join:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to send join request'
      );
    } finally {
      setRequestingChamaId(null);
    }
  };

  const filteredChamas = availableChamas.filter(
    chama =>
      chama.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chama.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chama.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPendingRequest = (chamaId: string) => {
    return pendingRequests.some(p => p.chamaId === chamaId);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50'>
        <OnBoardingNavbar />
      </header>

      <main className='container mx-auto px-4 py-8 mt-14 max-w-6xl'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold m-0'>
            Welcome to ChamaPlus, {user?.firstName || 'User'}! 👋
          </h1>
          <p className='text-muted-foreground m-0'>
            Create your own Chama or join an existing one to start managing
            group savings
          </p>
        </div>

        {/* Options Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* Create New Chama */}
          <Card
            className='hover:shadow-lg transition-shadow cursor-pointer'
            onClick={handleCreateChama}
          >
            <CardHeader>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <Plus className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <CardTitle>Create New Chama</CardTitle>
                  <CardDescription>
                    Start your own savings group and invite members to join
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className='w-full md:w-auto'>Get Started</Button>
            </CardContent>
          </Card>

          {/* Browse Existing Chamas */}
          <Card>
            <CardHeader>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center'>
                  <Users className='w-6 h-6 text-secondary' />
                </div>
                <div>
                  <CardTitle>Browse Existing Chamas</CardTitle>
                  <CardDescription>
                    Explore and join established savings groups in your area
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                {availableChamas.length} active Chamas available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className='mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <h3 className='font-medium text-yellow-800 dark:text-yellow-200 mb-2'>
              Pending Join Requests
            </h3>
            <div className='space-y-2'>
              {pendingRequests.map(request => (
                <div
                  key={request.chamaId}
                  className='flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300'
                >
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Waiting for approval from {request.chamaName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className='mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
            <Input
              placeholder='Search Chamas by name, location, or description...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Available Chamas List */}
        <div className='space-y-4'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
            </div>
          ) : filteredChamas.length === 0 ? (
            <div className='text-center py-12'>
              <Users className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium mb-2'>No Chamas Found</h3>
              <p className='text-muted-foreground mb-4'>
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Be the first to create a Chama!'}
              </p>
              <Button onClick={handleCreateChama}>Create New Chama</Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {filteredChamas.map(chama => (
                <Card
                  key={chama.id}
                  className='hover:shadow-md transition-shadow'
                >
                  <CardHeader className='pb-2'>
                    <div className='flex items-start justify-between'>
                      <CardTitle className='text-lg'>{chama.name}</CardTitle>
                      {chama.status && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            chama.status === 'Fixed'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                        >
                          {chama.status}
                        </span>
                      )}
                    </div>
                    <CardDescription className='line-clamp-2'>
                      {chama.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-4 mb-4'>
                      <div>
                        <p className='text-xs text-muted-foreground'>Members</p>
                        <p className='font-medium flex items-center gap-1'>
                          <Users className='w-4 h-4' />
                          {chama.memberCount}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground'>
                          Total Savings
                        </p>
                        <p className='font-medium'>
                          ~KSh {chama.totalSavings?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-2 text-sm text-muted-foreground mb-4'>
                      {chama.location && (
                        <div className='flex items-center gap-2'>
                          <MapPin className='w-4 h-4' />
                          <span>{chama.location}</span>
                        </div>
                      )}
                      {chama.contributionAmount && (
                        <div className='flex items-center gap-2'>
                          <span>~</span>
                          <span>
                            KSh {chama.contributionAmount.toLocaleString()} per
                            month
                          </span>
                        </div>
                      )}
                      {chama.meetingSchedule && (
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-4 h-4' />
                          <span>{chama.meetingSchedule}</span>
                        </div>
                      )}
                      {chama.admin && (
                        <div className='flex items-center gap-2'>
                          <User className='w-4 h-4' />
                          <span>Admin: {chama.admin}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className='w-full'
                      variant={
                        isPendingRequest(chama.id) ? 'outline' : 'default'
                      }
                      disabled={
                        isPendingRequest(chama.id) ||
                        requestingChamaId === chama.id
                      }
                      onClick={() => handleRequestToJoin(chama.id)}
                    >
                      {requestingChamaId === chama.id ? (
                        <>
                          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                          Sending Request...
                        </>
                      ) : isPendingRequest(chama.id) ? (
                        'Request Pending'
                      ) : (
                        'Request to Join'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChamaChoice;

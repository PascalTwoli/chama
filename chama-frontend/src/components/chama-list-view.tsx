import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import AuthService from '../services/auth/signup-service';
import { Chama } from '../models/chamas';
import ChamaService from '../services/chama/chama-services';
import { Button } from './ui/button';
import ProfileTemplate from '../utils/profile-template';

const ChamaListView: React.FC = () => {
  const [chamas, setChamas] = useState<Chama[]>([]);
  const [allChamas, setAllChamas] = useState<Chama[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    displayChamas();
  }, []);

  const handleSearchChama = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    const searchTermLower = searchValue.toLowerCase();
    if (searchTermLower === '') {
      setChamas(allChamas);
    } else {
      const filteredChamas = allChamas.filter(chama =>
        chama.name.toLowerCase().includes(searchTermLower)
      );
      setChamas(filteredChamas);
    }
  };

  const displayChamas = async () => {
    setIsLoading(true);
    try {
      const response = await ChamaService.fetchAllChamas();

      if (!response || !Array.isArray(response)) {
        throw new Error('Failed to fetch chamas');
      }

      const data = response.map((chama: Chama) => ({
        id: chama.id,
        name: chama.name,
        description: chama.description,
        membersCount: chama.membersCount,
        organisationRole: chama.organizationRole,
        rules: chama.rules,
        userId: chama.userId,
        userType: chama.userType,
        country: chama.country,
        createdAt: chama.createdAt,
        members: chama.members ?? [],
        imageUrl: chama.imageUrl ?? '',
        updatedAt: chama.updatedAt ?? '',
        createdBy: chama.createdBy,
      }));
      setChamas(data);
      setAllChamas(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load chamas. Please try again.'
      );
      console.error('Error fetching chamas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinChama = async (chamaId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chamas/${chamaId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join chama');
      }

      AuthService.markChamaJoiningComplete(chamaId);
      navigate(`/member/chamas/${chamaId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to join chama. Please try again.'
      );
      console.error('Error joining chama:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && chamas.length === 0) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-foreground text-center'>
          <Loader2 className='animate-spin h-12 w-12 mx-auto mb-4 text-primary' />
          <p className='text-xl'>Loading chamas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col py-3 px-4 bg-background'>
      <div className='flex flex-col h-full'>
        <h1 className='text-lg font-bold text-foreground mb-8 flex-shrink-0'>
          Join Chama
        </h1>

        {error && (
          <div className='bg-destructive/20 text-destructive p-4 rounded-lg border border-destructive/30 mb-6 flex-shrink-0'>
            {error}
          </div>
        )}

        {allChamas.length === 0 && !isLoading ? (
          <div className='bg-card border border-border rounded-lg p-8 text-center flex-shrink-0'>
            <p className='text-xl text-foreground mb-4'>
              No chamas available to join right now.
            </p>
            <p className='text-muted-foreground'>
              Please check back later or contact an administrator.
            </p>
          </div>
        ) : (
          <div className='bg-card border border-border rounded-lg py-4 px-4 mb-8 flex flex-col flex-1 min-h-0'>
            {/* Search */}
            <div className='relative flex-shrink-0'>
              <Search className='absolute text-muted-foreground top-1/2 -translate-y-1/2 left-4 w-5 h-5' />
              <input
                type='text'
                placeholder='Search chamas...'
                className='w-full p-4 pl-12 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground transition-colors'
                onChange={handleSearchChama}
              />
            </div>

            <p className='mb-2 mt-4 font-bold text-sm text-foreground flex-shrink-0'>
              Available chamas
            </p>

            {chamas.length === 0 && searchTerm !== '' ? (
              <div className='text-center py-8 flex-shrink-0'>
                <p className='text-muted-foreground text-lg'>
                  No chamas found matching &quot;{searchTerm}&quot;
                </p>
                <p className='text-muted-foreground/70 text-sm mt-2'>
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className='flex-1 overflow-y-auto min-h-0'>
                <div className='grid grid-cols-1 gap-6 pr-2'>
                  {chamas.map(chama => (
                    <div
                      key={chama.id}
                      className='bg-muted border border-border rounded-lg overflow-hidden'
                    >
                      <div className='p-6 flex flex-col lg:flex-row items-start gap-4'>
                        <div className='flex-auto w-2/3'>
                          <h2 className='text-lg m-0 font-bold text-foreground mt-0 mb-2'>
                            {chama.name}
                          </h2>
                          <div className='flex flex-col justify-between'>
                            <div>
                              <p className='text-muted-foreground m-0 text-sm'>
                                {chama.description}
                              </p>
                              <div className='flex justify-between text-sm text-muted-foreground mb-4 mt-2'>
                                <span>Members: {chama.membersCount}</span>
                                <span>
                                  Created:{' '}
                                  {new Date(
                                    chama.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <Button
                                onClick={() => handleJoinChama(chama.id)}
                                disabled={isLoading}
                                className='rounded-full'
                              >
                                Request to Join
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className='flex-auto w-1/3 rounded-2xl overflow-hidden'>
                          <div className='h-[170px] rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-primary/50'>
                            {ProfileTemplate(
                              {
                                profilepic: chama.imageUrl,
                              },
                              500,
                              500
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChamaListView;

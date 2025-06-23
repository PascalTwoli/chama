import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth/signup-service';
import { Chama } from '../models/chamas';
import ChamaService from '../services/chama-services';
import { Button } from 'primereact/button';
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
      setChamas(data);
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

      // Mark chama joining as complete
      AuthService.markChamaJoiningComplete(chamaId);

      // Redirect to member dashboard
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
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='text-white text-center'>
          <svg
            className='animate-spin h-12 w-12 mx-auto mb-4 text-green-500'
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
          <p className='text-xl'>Loading chamas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col py-3 px-4'>
      <div className='flex flex-col h-full'>
        <h1 className='text-lg font-bold text-white mb-8 flex-shrink-0'>
          Join Chama
        </h1>

        {error && (
          <div className='bg-red-800 text-white p-4 rounded mb-6 flex-shrink-0'>
            {error}
          </div>
        )}

        {allChamas.length === 0 && !isLoading ? (
          <div className='bg-gray-800 rounded-lg p-8 text-center flex-shrink-0'>
            <p className='text-xl text-gray-300 mb-4'>
              No chamas available to join right now.
            </p>
            <p className='text-gray-400'>
              Please check back later or contact an administrator.
            </p>
          </div>
        ) : (
          <div className='bg-[#242E3B] rounded-lg py-2 px-2 mb-8 flex flex-col flex-1 min-h-0'>
            <div className='relative flex-shrink-0'>
              <i className='pi pi-search absolute text-gray-500 font-normal top-[15px] left-4 text-xl'></i>
              <input
                type='text'
                placeholder='Search chamas...'
                className='w-full p-4 pl-14 outline-none rounded-lg bg-gray-100 border-none text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4084B9] placeholder:text-gray-400'
                onChange={handleSearchChama}
              />
            </div>
            <p className='mb-[6px] mt-4 font-bold text-sm flex-shrink-0'>
              {' '}
              Available chamas{' '}
            </p>
            {chamas.length === 0 && searchTerm !== '' ? (
              <div className='text-center py-8 flex-shrink-0'>
                <p className='text-gray-400 text-lg'>
                  No chamas found matching &quot;{searchTerm}&quot;
                </p>
                <p className='text-gray-500 text-sm mt-2'>
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className='flex-1 overflow-y-auto min-h-0'>
                <div className='grid grid-cols-1 lg:grid-cols-1 gap-6 pr-2'>
                  {chamas.map(chama => (
                    <div
                      key={chama.id}
                      className='bg-gray-800 rounded-lg overflow-hidden shadow-lg'
                    >
                      <div className='p-6 flex flex-col lg:flex-row items-start gap-4'>
                        <div className='flex-auto w-2/3'>
                          <h2 className='text-lg m-0 font-bold text-[#A0A1A2] mt-0 mb-2'>
                            {chama.name}
                          </h2>
                          <div className='flex flex-col justify-between'>
                            <div>
                              {' '}
                              <p className='text-[#61758A] m-0 text-sm'>
                                {chama.description}
                              </p>
                              <div className='flex justify-between text-sm text-gray-400 mb-4'>
                                <span>Members: {chama.membersCount}</span>
                                <span>
                                  Created:
                                  {new Date(
                                    chama.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className='text-center'>
                                <Button
                                  onClick={() => handleJoinChama(chama.id)}
                                  disabled={isLoading}
                                  className='py-2 border-none text-white rounded-full transition-colors bg-gradient-to-br from-[#4084B9] to-[#2D3748] hover:from-[#2D3748] hover:to-[#488ec3]'
                                >
                                  Request to Join
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='flex-auto w-1/3 rounded-2xl overflow-hidden'>
                          <div
                            className='h-[170px] rounded-lg flex items-center justify-center'
                            style={{
                              background:
                                'linear-gradient(135deg, #4084B9 0%, #2D3748 100%)',
                            }}
                          >
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

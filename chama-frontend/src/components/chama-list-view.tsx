import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth/signup-service';
import { Chama } from '../models/chamas';
import ChamaService from '../services/chama-services';

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
    <div className='min-h-screen py-3 px-4'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-lg font-bold text-white mb-8'>Join a Chama</h1>

        {error && (
          <div className='bg-red-800 text-white p-4 rounded mb-6'>{error}</div>
        )}

        {allChamas.length === 0 && !isLoading ? (
          <div className='bg-gray-800 rounded-lg p-8 text-center'>
            <p className='text-xl text-gray-300 mb-4'>
              No chamas available to join right now.
            </p>
            <p className='text-gray-400'>
              Please check back later or contact an administrator.
            </p>
          </div>
        ) : (
          <div className='bg-[#242E3B] rounded-lg py-2 px-2 mb-8'>
            <div>
              <input
                type='text'
                placeholder='Search chamas...'
                className='w-full p-4 outline-none rounded bg-gray-100 border-none text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-xl placeholder:text-gray-400'
                onChange={handleSearchChama}
              />
            </div>
            <p className='mb-[6px] mt-4 font-bold text-sm'>Available chamas</p>
            {chamas.length === 0 && searchTerm !== '' ? (
              <div className='text-center py-8'>
                <p className='text-gray-400 text-lg'>
                  No chamas found matching &quot;{searchTerm}&quot;
                </p>
                <p className='text-gray-500 text-sm mt-2'>
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-1 gap-6 '>
                {chamas.map(chama => (
                  <div
                    key={chama.id}
                    className='bg-gray-800 rounded-lg overflow-hidden shadow-lg'
                  >
                    <div className='p-6'>
                      <h2 className='text-xl font-bold text-white mb-2'>
                        {chama.name}
                      </h2>
                      <p className='text-gray-300 mb-4'>{chama.description}</p>
                      <div className='flex justify-between text-sm text-gray-400 mb-4'>
                        <span>Members: {chama.membersCount}</span>
                        <span>
                          Created:
                          {new Date(chama.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleJoinChama(chama.id)}
                        disabled={isLoading}
                        className='w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors'
                      >
                        Join Chama
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChamaListView;

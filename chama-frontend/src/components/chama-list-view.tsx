import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth/signup-service';

interface Chama {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

const ChamaListView: React.FC = () => {
  const [chamas, setChamas] = useState<Chama[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChamas();
  }, []);

  const fetchChamas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chamas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chamas');
      }

      const data = await response.json();
      setChamas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chamas. Please try again.');
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
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
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
      setError(err instanceof Error ? err.message : 'Failed to join chama. Please try again.');
      console.error('Error joining chama:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && chamas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl">Loading chamas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Available Chamas</h1>
        
        {error && (
          <div className="bg-red-800 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}
        
        {chamas.length === 0 && !isLoading ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-300 mb-4">No chamas available to join right now.</p>
            <p className="text-gray-400">Please check back later or contact an administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chamas.map(chama => (
              <div key={chama.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">{chama.name}</h2>
                  <p className="text-gray-300 mb-4">{chama.description}</p>
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <span>Members: {chama.memberCount}</span>
                    <span>Created: {new Date(chama.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleJoinChama(chama.id)}
                    disabled={isLoading}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Join Chama
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChamaListView;

// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { useEffect, useState } from 'react';
// import { ColumnBodyOptions } from 'primereact/column';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Button } from 'primereact/button';

// const profileTemplate = (rowData: any, options: ColumnBodyOptions) => {
//     <img src={rowData.profilepic} alt="profile" className="w-10 h-10 rounded-full" />
// };

// const actionsTemplate = (rowData: any, options: ColumnBodyOptions) => (
//     <div className="flex gap-2">
//         <button className="text-blue-500">Edit</button>
//         <button className="text-red-500">Delete</button>
//     </div>
// );

// const ChamaListView = ()  => {

//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [members, setMembers] = useState([]);

//     const columns = [
//         {field: 'profilepic', header: '#', width: '15%'},
//         {field: 'name', header: 'Name', width: '20%'},
//         {field: 'email', header: 'E-mail', width: '20%'},
//         {field: 'phonenumber', header: 'Phone Number', width: '15%'},
//         {field: 'shares', header: 'Share', width: '15%'},
//         {field: 'actions', header: 'Actions', width: '15%'},
//     ]

//     const chamaId = useParams().chamaId;

//                 // test data
//                 useEffect (() => {
//                     const mockData = [
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },            
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         },            
//                         {
//                             id: 1,
//                             profilepic: '/assets/avatar1.png',
//                             name: 'Alice Wanjiru',
//                             email: 'alice@example.com',
//                             phonenumber: '0712345678',
//                             shares: 100,
//                             actions: 'Edit/Delete'
//                         },
//                         {
//                             id: 2,
//                             profilepic: '/assets/avatar2.png',
//                             name: 'Brian Otieno',
//                             email: 'brian@example.com',
//                             phonenumber: '0798765432',
//                             shares: 80,
//                             actions: 'Edit/Delete'
//                         }
//                     ];
            
//                     setMembers (mockData => mockData) 
//                 }, [])
//     return (
//         <>
//             <div className="card">
//                     <DataTable value={members} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
//                         {columns.map((col) => (
//                             <Column 
//                                 key={col.field} 
//                                 field={col.field} 
//                                 header={col.header} 
//                                 style={{width: col.width, padding: '2px 0'}} 
//                                 // body={col.field === 'profilepic' ? profileTemplate : col.field === 'actions' ? actionsTemplate : undefined }
//                             />
//                         ))}
//                     </DataTable>
//                 </div>

//             <div className='mt-10 flex justify-end'>
//                 <Button className="p-button-success" onClick={
//                     () => navigate(`/chama/${chamaId}/join`)
                    
//                     }>
//                     Join Chama {chamaId}
//                 </Button>
//             </div>
//         </>
//     )
// }

// export default ChamaListView;
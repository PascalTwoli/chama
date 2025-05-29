import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth/signup-service';

// Component for creating a new chama (for admin users)
const CreateChama: React.FC = () => {
  const [chamaName, setChamaName] = useState('');
  const [chamaDescription, setChamaDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Make API call to create a chama
      const response = await fetch('/api/chamas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          name: chamaName,
          description: chamaDescription
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create chama');
      }

      const data = await response.json();
      
      // Mark chama creation as complete
      AuthService.markChamaCreationComplete(data.id);
      
      // Redirect to admin dashboard
      navigate(`/admin/chamas/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chama. Please try again.');
      console.error('Error creating chama:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Create Your Chama
        </h1>
        
        {error && (
          <div className="bg-red-800 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="chamaName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Chama Name
            </label>
            <input
              id="chamaName"
              type="text"
              required
              value={chamaName}
              onChange={(e) => setChamaName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter chama name"
            />
          </div>
          
          <div>
            <label 
              htmlFor="chamaDescription"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="chamaDescription"
              rows={4}
              value={chamaDescription}
              onChange={(e) => setChamaDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe your chama"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 ${
                isLoading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
              } text-white rounded-md font-semibold transition-colors flex justify-center items-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Chama...
                </>
              ) : (
                'Create Chama'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChama;



// import { useState } from 'react';
// import { Button } from 'primereact/button'; 
// import { useNavigate, useParams } from 'react-router-dom';


// const tabs = ['Basic', 'Features', 'Terms'];

// interface ChamaFormData {
//   name: string;
//   about: string;
//   image: File | null;
// }


// function CreateChama() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState<ChamaFormData>({
//     name: '',
//     about: '',
//     image: null,
//   });

//   const navigate = useNavigate();
//   const chamaId = useParams().chamaId || 'new'; // Default to 'new' if chamaId is not provided
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const renderStepContent = () => {
//     switch (activeStep) {
//       case 0:
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6  bg-[#242E3B] p-8 pb-18 rounded-xl">
//             <div className="flex flex-col gap-4">
//               <label className="font-bold text-white">Name<span className="text-red-500">*</span></label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Chama Name"
//                 className="p-2 rounded border border-gray-500 bg-transparent text-white"
//                 value={formData.name}
//                 onChange={handleInputChange}
//               />
//               <label className="font-bold text-white">About</label>
//               <textarea
//                 name="about"
//                 placeholder="Description of the Group"
//                 className="p-2 rounded border border-gray-500 bg-transparent text-white"
//                 value={formData.about}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
//               <i className="bi bi-image fs-1 text-7xl"></i>
//               <span>Upload an Image / Profile of the Chama</span>
//               <input
//                 type="file"
//                 onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
//                 className="text-white"
//               />
//             </div>
//           </div>
//         );
//       case 1:
//         return  (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-14  bg-[#242E3B] p-8 pb-18 rounded-xl ">
//             <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
//               <div><i className="bi bi-person-circle w-24"></i></div>
//               <div className='flex-1 '>
//                 <h4 className='m-0 font-bold'>Membership</h4>
//                 <p className='m-0'>Manage, add, remove and disable group...</p>
//               </div>
//             </div>
//             <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
//               <div><i className="bi bi-coin"></i></div>
//               <div className='flex-1 '>
//                 <h4 className='m-0 font-bold'>Softloans</h4>
//                 <p className='m-0'>Enables a group to give to members a...</p>
//               </div>
//             </div>
//             <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
//               <div><i className="bi bi-pie-chart-fill"></i></div>
//               <div className='flex-1 '>
//                 <h4 className='m-0 font-bold'>Shares</h4>
//                 <p className='m-0'>Members are able to contribute towards...</p>
//               </div>
//             </div>
//             <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
//               <div><i className="bi bi-snow3"></i></div>
//               <div className='flex-1 overflow-hidden'>
//                 <h4 className='m-0 font-bold'>Meetings</h4>
//                 <p className='m-0'>Ability to manage meetings, have minutes...</p>
//               </div>
//             </div>
//             <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
//               <div><i className="bi bi-bell"></i></div>
//               <div className='flex-1 overflow-hidden'>
//                 <h4 className='m-0 font-bold'>Notifications</h4>
//                 <p className='m-0'>Gives a way to reach members of the gro...</p>
//               </div>
//             </div>
//             <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
//               <div><i className="bi bi-wallet-fill"></i></div>
//               <div className='flex-1 overflow-hidden h-74'>
//                 <h4 className='m-0 font-bold'>M-pesa</h4>
//                 <p className='m-0'>Receive payments directly from the group...</p>
//               </div>
//             </div>
//             <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
//               <div><i className="bi bi-person-gear"></i></div>
//               <div className='flex-1 overflow-hidden h-74'>
//                 <h4 className='m-0 font-bold'>Accounts</h4>
//                 <p className='m-0'>To manage money flow in the group</p>
//               </div>
//             </div>
            
//           </div>
//         )  
//       case 2:
//         return <div className="text-white p-6">Terms form goes here</div>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-[#0F172A] p-8 text-white">
//       <h2 className="text-2xl font-bold mb-6">Create a new Chama</h2>

//       {/* Tabs */}
//       <div className="flex mb-6 gap-4">
//         {tabs.map((tab, index) => (
//           <Button
//             key={tab}
//             className={`py-1 px-4 rounded flex-1 border-0 ${activeStep === index ? 'bg-[#4084B9] text-white' : 'bg-white text-gray-500'}`}
//             onClick={() => setActiveStep(index)}
//           >
//             {tab}
//           </Button>
//         ))}
//       </div>

//       {/* Step Content */}
//       {renderStepContent()}

//       {/* Navigation Buttons */}
//       <div className="flex justify-end gap-4 mt-6">
//         {activeStep > 0 && (
//           <Button className='bg-[#4084B9] border-0' onClick={() => setActiveStep(prev => prev - 1)}> {/**variant="outline" */}
//             Previous
//           </Button>
//         )}
//         {activeStep < tabs.length - 1 && (
//           <Button className='bg-[#4084B9] border-0 ' onClick={() => setActiveStep(prev => prev + 1)}>
//             Next
//           </Button>
//         )}
//         {activeStep === tabs.length - 1 && (
//           <Button 
//           className="bg-green-500 hover:bg-green-600"
//           onClick={() => {
//             navigate(`/admin/chamas/1`);
//           }}
//           >Submit</Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CreateChama;
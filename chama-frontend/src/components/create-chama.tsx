

import { useState } from 'react';
import { Button } from 'primereact/button'; 
import { useNavigate, useParams } from 'react-router-dom';


const tabs = ['Basic', 'Features', 'Terms'];

interface ChamaFormData {
  name: string;
  about: string;
  image: File | null;
}


function CreateChama() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ChamaFormData>({
    name: '',
    about: '',
    image: null,
  });

  const navigate = useNavigate();
  const chamaId = useParams().chamaId || 'new'; // Default to 'new' if chamaId is not provided
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  bg-[#242E3B] p-8 pb-18 rounded-xl">
            <div className="flex flex-col gap-4">
              <label className="font-bold text-white">Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Chama Name"
                className="p-2 rounded border border-gray-500 bg-transparent text-white"
                value={formData.name}
                onChange={handleInputChange}
              />
              <label className="font-bold text-white">About</label>
              <textarea
                name="about"
                placeholder="Description of the Group"
                className="p-2 rounded border border-gray-500 bg-transparent text-white"
                value={formData.about}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
              <i className="bi bi-image fs-1 text-7xl"></i>
              <span>Upload an Image / Profile of the Chama</span>
              <input
                type="file"
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                className="text-white"
              />
            </div>
          </div>
        );
      case 1:
        return  (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-14  bg-[#242E3B] p-8 pb-18 rounded-xl ">
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div><i className="bi bi-person-circle w-24"></i></div>
              <div className='flex-1 '>
                <h4 className='m-0 font-bold'>Membership</h4>
                <p className='m-0'>Manage, add, remove and disable group...</p>
              </div>
            </div>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div><i className="bi bi-coin"></i></div>
              <div className='flex-1 '>
                <h4 className='m-0 font-bold'>Softloans</h4>
                <p className='m-0'>Enables a group to give to members a...</p>
              </div>
            </div>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div><i className="bi bi-pie-chart-fill"></i></div>
              <div className='flex-1 '>
                <h4 className='m-0 font-bold'>Shares</h4>
                <p className='m-0'>Members are able to contribute towards...</p>
              </div>
            </div>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div><i className="bi bi-snow3"></i></div>
              <div className='flex-1 overflow-hidden'>
                <h4 className='m-0 font-bold'>Meetings</h4>
                <p className='m-0'>Ability to manage meetings, have minutes...</p>
              </div>
            </div>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div><i className="bi bi-bell"></i></div>
              <div className='flex-1 overflow-hidden'>
                <h4 className='m-0 font-bold'>Notifications</h4>
                <p className='m-0'>Gives a way to reach members of the gro...</p>
              </div>
            </div>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div><i className="bi bi-wallet-fill"></i></div>
              <div className='flex-1 overflow-hidden h-74'>
                <h4 className='m-0 font-bold'>M-pesa</h4>
                <p className='m-0'>Receive payments directly from the group...</p>
              </div>
            </div>
            <div className='create-chama-features flex gap-2 p-3 rounded text-gray-400'>
              <div><i className="bi bi-person-gear"></i></div>
              <div className='flex-1 overflow-hidden h-74'>
                <h4 className='m-0 font-bold'>Accounts</h4>
                <p className='m-0'>To manage money flow in the group</p>
              </div>
            </div>
            
          </div>
        )  
      case 2:
        return <div className="text-white p-6">Terms form goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0F172A] p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Create a new Chama</h2>

      {/* Tabs */}
      <div className="flex mb-6 gap-4">
        {tabs.map((tab, index) => (
          <Button
            key={tab}
            className={`py-1 px-4 rounded flex-1 border-0 ${activeStep === index ? 'bg-[#4084B9] text-white' : 'bg-white text-gray-500'}`}
            onClick={() => setActiveStep(index)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        {activeStep > 0 && (
          <Button className='bg-[#4084B9] border-0' onClick={() => setActiveStep(prev => prev - 1)}> {/**variant="outline" */}
            Previous
          </Button>
        )}
        {activeStep < tabs.length - 1 && (
          <Button className='bg-[#4084B9] border-0 ' onClick={() => setActiveStep(prev => prev + 1)}>
            Next
          </Button>
        )}
        {activeStep === tabs.length - 1 && (
          <Button 
          className="bg-green-500 hover:bg-green-600"
          onClick={() => {
            navigate(`/admin/chamas/1`);
          }}
          >Submit</Button>
        )}
      </div>
    </div>
  );
}

export default CreateChama;
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MembersTable from './membership.table';
import ChamaService from '../services/chama/chama-services';

function Membership() {
  const { chamaId } = useParams<{ chamaId: string }>();
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [chamaName, setChamaName] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chama data when component mounts or chamaId changes
  useEffect(() => {
    const fetchChamaData = async () => {
      if (!chamaId) {
        setChamaName('Unknown Chama');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const chamaData = await ChamaService.getChamaById(chamaId);
        setChamaName(chamaData.name || 'Unknown Chama');
      } catch (error) {
        console.error('Error fetching chama data:', error);
        setChamaName('Error loading chama name');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChamaData();
  }, [chamaId]);

  const roles = [
    { label: 'All members', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Disabled', value: 'disabled' },
  ];
  const status = [
    { label: 'All status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ];
  return (
    <div className=' p-3 '>
      {/* membership header */}
      <div className='flex justify-between items-center rounded-md'>
        {/* Title */}
        <div>
          {/* <h2 className='text-white text-xl font-bold'>
            {isLoading ? 'Loading...' : chamaName} - Group Members
          </h2>
          <p className='text-gray-400 text-sm'>
            Chama ID: {chamaId || 'Unknown'}
          </p> */}
          <h2 className='text-white text-base font-bold m-0'>
            Membership Management
          </h2>
          <p className='text-gray-400 text-sm m-0'>
            Manage members across all your chamas
          </p>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-4'>
          {/* Add Member Button */}
          <Button
            type='button'
            className=' flex gap-3 p-button-outlined p-button-info text-[#4084B9]  border-solid border rounded-xl p-2'
          >
            <i className='pi bi-person-plus'></i>
            Add Member
          </Button>
        </div>
      </div>
      <div className='mt-8 p-6 bg-primarybg rounded-lg'>
        <div className='flex gap-20 items-start flex-row'>
          <div className='flex-1 text-gray-400 font-bold relative mb-10'>
            <i className='pi pi-search absolute top-2.5 left-3 text-xl text-[#A0A1A24D]'></i>
            <input
              type='text'
              placeholder='Search members...'
              className='w-full p-3 pl-10 border-none rounded-lg bg-[#525A6433] placeholder:font-bold placeholder:text-[#A0A1A24D]   px-2'
            />
          </div>
          <div className='flex flex-row gap-5'>
            <div className='card flex justify-content-center'>
              <Dropdown
                value={selectedRole}
                onChange={e => setSelectedRole(e.value)}
                options={roles}
                optionLabel='label'
                placeholder=''
                className={`membership-dropdown w-37 hover:bg-[#4084B9] rounded-md text-black hover:text-white`}
                panelClassName=' rounded-md mt-2 '
                pt={{
                  root: {
                    className: '',
                  },
                  panel: {
                    className: 'bg-gray-800 rounded-md py-2',
                  },
                  item: {
                    className:
                      'hover:bg-gray-400 hover:text-black px-3 py-2 cursor-pointer bg-blue text-white',
                  },
                }}
              />
            </div>
            <div className='card flex justify-content-center'>
              <Dropdown
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.value)}
                options={status}
                optionLabel='label'
                placeholder=''
                className={`membership-dropdown w-30 hover:bg-[#4084B9] rounded-md text-black hover:text-white`}
                panelClassName=' rounded-md mt-2 '
                pt={{
                  root: {
                    className: '',
                  },
                  panel: {
                    className: 'bg-gray-800 rounded-md py-2',
                  },
                  item: {
                    className:
                      'hover:bg-gray-400 hover:text-black px-3 py-2 cursor-pointer bg-blue text-white',
                  },
                }}
              />
            </div>
          </div>
        </div>
        <MembersTable />
      </div>
    </div>
  );
}

export default Membership;

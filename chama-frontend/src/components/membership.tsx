import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import MembersTable from './membership.table';
import ChamaService from '../services/chama/chama-services';
import { Button } from './ui/button';

function Membership() {
  const { chamaId } = useParams<{ chamaId: string }>();
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [, setChamaName] = useState<string>('Loading...');
  const [, setIsLoading] = useState(true);

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

  const statusOptions = [
    { label: 'All status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ];

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-xl font-bold text-foreground mb-1'>
            Membership Management
          </h2>
          <p className='text-sm text-muted-foreground'>
            Manage members across all your chamas
          </p>
        </div>

        <Button className='gap-2'>
          <UserPlus className='w-4 h-4' />
          Add Member
        </Button>
      </div>

      {/* Filters Card */}
      <div className='p-6 bg-card border border-border rounded-xl'>
        <div className='flex gap-6 items-start flex-col md:flex-row mb-6'>
          {/* Search */}
          <div className='flex-1 relative'>
            <Search className='absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search members...'
              className='w-full p-3 pl-10 border border-border rounded-lg bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
            />
          </div>

          {/* Dropdowns */}
          <div className='flex gap-4'>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className='px-4 py-3 border border-border rounded-lg bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className='px-4 py-3 border border-border rounded-lg bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <MembersTable />
      </div>
    </div>
  );
}

export default Membership;

import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Download,
  Search,
  Activity,
  Calendar,
  Users,
  CreditCard,
  Settings,
  UserPlus,
  UserMinus,
  FileText,
  Shield,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface LogEntry {
  id: string;
  type:
    | 'Contribution'
    | 'Settings'
    | 'Member Added'
    | 'Loan Issued'
    | 'Expense'
    | 'Role Changed'
    | 'Report'
    | 'Member Removed';
  user: {
    name: string;
    role: string; // e.g., Admin, Treasurer
    roleColor?: string; // e.g. 'text-blue-600'
  };
  action: string;
  details: string;
  timestamp: string; // "17 Jan, 14:32"
  ipAddress: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    type: 'Contribution',
    user: { name: 'John Kamau', role: 'Admin' },
    action: 'Recorded contribution',
    details: 'Recorded KSh 5,000 contribution from Mary Wanjiku',
    timestamp: '17 Jan, 14:32',
    ipAddress: '197.254.45.123',
  },
  {
    id: '2',
    type: 'Settings',
    user: { name: 'John Kamau', role: 'Admin' },
    action: 'Updated Chama settings',
    details: 'Changed contribution model from Fixed to Flexible',
    timestamp: '17 Jan, 12:15',
    ipAddress: '197.254.45.123',
  },
  {
    id: '3',
    type: 'Member Added',
    user: { name: 'John Kamau', role: 'Admin' },
    action: 'Added new member',
    details: 'Added Paul Kiptoo as a Regular Member',
    timestamp: '16 Jan, 16:45',
    ipAddress: '197.254.45.123',
  },
  {
    id: '4',
    type: 'Loan Issued',
    user: { name: 'Mary Wanjiku', role: 'Treasurer' },
    action: 'Issued loan',
    details: 'Issued KSh 50,000 loan to Peter Ochieng at 5% interest',
    timestamp: '15 Jan, 10:20',
    ipAddress: '41.90.189.234',
  },
  {
    id: '5',
    type: 'Expense',
    user: { name: 'Mary Wanjiku', role: 'Treasurer' },
    action: 'Recorded expense',
    details: 'Recorded KSh 5,000 expense for meeting venue rental',
    timestamp: '15 Jan, 09:15',
    ipAddress: '41.90.189.234',
  },
  {
    id: '6',
    type: 'Role Changed',
    user: { name: 'John Kamau', role: 'Admin' },
    action: 'Changed member role',
    details: 'Changed Sarah Njeri from Regular Member to Secretary',
    timestamp: '14 Jan, 18:30',
    ipAddress: '197.254.45.123',
  },
  {
    id: '7',
    type: 'Report',
    user: { name: 'Grace Akinyi', role: 'Auditor' },
    action: 'Generated report',
    details: 'Generated Monthly Financial Report for December 2025',
    timestamp: '12 Jan, 11:45',
    ipAddress: '105.160.37.89',
  },
  {
    id: '8',
    type: 'Member Removed',
    user: { name: 'John Kamau', role: 'Admin' },
    action: 'Removed member',
    details: 'Removed David Otieno from the Chama',
    timestamp: '10 Jan, 13:20',
    ipAddress: '197.254.45.123',
  },
];

export default function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getBadge = (type: string) => {
    let style = '';
    let Icon = Activity;

    switch (type) {
      case 'Contribution':
        style = 'bg-blue-100 text-blue-800 border-blue-200';
        Icon = CreditCard; // Or DollarSign
        break;
      case 'Settings':
        style = 'bg-gray-100 text-gray-800 border-gray-200';
        Icon = Settings;
        break;
      case 'Member Added':
        style = 'bg-green-100 text-green-800 border-green-200';
        Icon = UserPlus;
        break;
      case 'Loan Issued':
        style = 'bg-purple-100 text-purple-800 border-purple-200';
        Icon = CreditCard; // Or specific loan icon
        break;
      case 'Expense':
        style = 'bg-orange-100 text-orange-800 border-orange-200';
        Icon = CreditCard;
        break;
      case 'Role Changed':
        style = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        Icon = Shield;
        break;
      case 'Report':
        style = 'bg-cyan-100 text-cyan-800 border-cyan-200';
        Icon = FileText;
        break;
      case 'Member Removed':
        style = 'bg-red-100 text-red-800 border-red-200';
        Icon = UserMinus;
        break;
      default:
        style = 'bg-gray-100 text-gray-800';
    }

    return (
      <span
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border w-fit',
          style
        )}
      >
        <Icon className='w-3 h-3' />
        {type}
      </span>
    );
  };

  return (
    <div className='p-6 space-y-6'>
      <PageHeader
        title='Activity Log'
        subtitle='Complete audit trail of all Chama actions'
        action={
          <Button variant='outline' className='gap-2'>
            <Download className='w-4 h-4' />
            Export Log
          </Button>
        }
      />

      {/* KPIs */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                Total Activities
              </p>
              <h3 className='text-2xl font-bold mt-1'>10</h3>
            </div>
            <div className='w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center'>
              <Shield className='w-5 h-5' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                Today&apos;s Activities
              </p>
              <h3 className='text-2xl font-bold mt-1'>0</h3>
            </div>
            <div className='w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center'>
              <Calendar className='w-5 h-5' />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>
                Active Users
              </p>
              <h3 className='text-2xl font-bold mt-1'>3</h3>
            </div>
            <div className='w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center'>
              <Users className='w-5 h-5' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log Table Section */}
      <div className='space-y-4'>
        {/* Toolbar & Header */}
        <div className='bg-card rounded-t-lg border-x border-t border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-4 border-b gap-4'>
          <div className='relative w-full sm:w-96'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search activities...'
              className='pl-9 bg-background'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2 w-full sm:w-auto'>
            <Button variant='outline' className='w-full sm:w-auto'>
              All Types
            </Button>
            <Button variant='outline' className='w-full sm:w-auto'>
              All Users
            </Button>
          </div>
        </div>

        <Card className='border border-border shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-border'>
            <h3 className='font-semibold text-lg'>Activity Timeline</h3>
            <p className='text-sm text-muted-foreground'>
              You haven&apos;t performed any activities yet.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/30 hover:bg-muted/30'>
                <TableHead className='w-[180px]'>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{getBadge(log.type)}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs'>
                        <Users className='w-3 h-3' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-medium text-sm'>
                          {log.user.name}
                        </span>
                        <span className='text-[10px] text-muted-foreground'>
                          ({log.user.role})
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='font-medium'>{log.action}</TableCell>
                  <TableCell
                    className='text-muted-foreground text-sm max-w-xs truncate'
                    title={log.details}
                  >
                    {log.details}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-xs whitespace-nowrap'>
                    {log.timestamp}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-xs font-mono'>
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

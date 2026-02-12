import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Shield,
  Search,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Card, CardContent } from '../components/ui/card';

// Mock Data
interface RoleCount {
  role: string;
  count: number;
}
const roleCounts: RoleCount[] = [
  { role: 'Admin', count: 1 },
  { role: 'Treasurer', count: 1 },
  { role: 'Secretary', count: 1 },
  { role: 'Auditor', count: 1 },
  { role: 'Regular Member', count: 6 },
];

interface MemberRole {
  id: string;
  name: string;
  contact: string;
  role: string;
  joined: string;
  email: string; // for display under name
  roleType: 'Admin' | 'Treasurer' | 'Secretary' | 'Auditor' | 'Regular Member';
}

const mockMemberRoles: MemberRole[] = [
  {
    id: '1',
    name: 'John Kamau',
    email: 'john.kamau@email.com',
    contact: '0712345678',
    role: 'Admin',
    roleType: 'Admin',
    joined: 'Jan 2024',
  },
  {
    id: '2',
    name: 'Mary Wanjiku',
    email: 'mary.wanjiku@email.com',
    contact: '0723456789',
    role: 'Treasurer',
    roleType: 'Treasurer',
    joined: 'Jan 2024',
  },
  {
    id: '3',
    name: 'Sarah Njeri',
    email: 'sarah.njeri@email.com',
    contact: '0734567890',
    role: 'Secretary',
    roleType: 'Secretary',
    joined: 'Feb 2024',
  },
  {
    id: '4',
    name: 'Grace Akinyi',
    email: 'grace.akinyi@email.com',
    contact: '0745678901',
    role: 'Auditor',
    roleType: 'Auditor',
    joined: 'Mar 2024',
  },
  {
    id: '5',
    name: 'Peter Ochieng',
    email: 'peter.ochieng@email.com',
    contact: '0756789012',
    role: 'Regular Member',
    roleType: 'Regular Member',
    joined: 'Apr 2024',
  },
];

// Permissions Matrix Data
const permissions = [
  'View Financial Reports',
  'Record Contributions',
  'Record Expenses',
  'Issue Loans',
  'Add/Remove Members',
  'Change Member Roles',
  'Modify Chama Settings',
  'Schedule Meetings',
  'Send Announcements',
  'Audit Financial Records',
  'View Activity Log',
  'Generate Reports',
];

const roles = ['Admin', 'Treasurer', 'Secretary', 'Auditor', 'Member'];

// Mock permissions map (true = allowed)
// This is hardcoded for UI demo
const permissionsMap: Record<string, string[]> = {
  Admin: permissions, // All
  Treasurer: [
    'View Financial Reports',
    'Record Contributions',
    'Record Expenses',
    'Issue Loans',
    'Generate Reports',
    'View Activity Log',
  ],
  Secretary: [
    'View Financial Reports',
    'Add/Remove Members',
    'Schedule Meetings',
    'Send Announcements',
  ],
  Auditor: [
    'View Financial Reports',
    'Audit Financial Records',
    'View Activity Log',
    'Generate Reports',
  ],
  Member: ['View Financial Reports'],
};

export default function RolesAndPermissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      Admin: 'bg-blue-100 text-blue-800 border-blue-200',
      Treasurer: 'bg-green-100 text-green-800 border-green-200',
      Secretary: 'bg-orange-100 text-orange-800 border-orange-200',
      Auditor: 'bg-purple-100 text-purple-800 border-purple-200',
      'Regular Member': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
      <span
        className={cn(
          'px-2.5 py-0.5 rounded-full text-xs font-medium border',
          styles[role] || styles['Regular Member']
        )}
      >
        {role}
      </span>
    );
  };

  return (
    <div className='p-6 space-y-8'>
      <PageHeader
        title='Member Roles & Permissions'
        subtitle='Manage member access and responsibilities'
      />

      {/* Role Counts Cards */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {roleCounts.map(rc => (
          <Card key={rc.role} className='text-center'>
            <CardContent className='p-6 flex flex-col items-center gap-2'>
              <div className='w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1'>
                <Shield className='w-5 h-5' />
              </div>
              <h3 className='text-2xl font-bold'>{rc.count}</h3>
              <p className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>
                {rc.role}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Roles Section */}
      <div className='bg-card rounded-lg border border-border shadow-sm'>
        <div className='p-6 border-b border-border space-y-4'>
          <div>
            <h3 className='font-semibold text-lg'>Member Roles</h3>
            <p className='text-sm text-muted-foreground'>
              Assign and manage member permissions
            </p>
          </div>

          <div className='relative max-w-md'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search members...'
              className='pl-9'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className='text-right'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMemberRoles.map(member => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium'>
                      {member.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className='font-medium text-sm'>{member.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.contact}</TableCell>
                <TableCell>{getRoleBadge(member.roleType)}</TableCell>
                <TableCell className='text-muted-foreground'>
                  {member.joined}
                </TableCell>
                <TableCell className='text-right'>
                  <Button variant='ghost' size='sm' className='gap-2 h-8'>
                    <Edit2 className='w-3 h-3' />
                    Edit Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Permissions Matrix Section */}
      <div className='bg-card rounded-lg border border-border shadow-sm'>
        <div className='p-6 border-b border-border'>
          <h3 className='font-semibold text-lg'>Permissions Matrix</h3>
          <p className='text-sm text-muted-foreground'>
            Overview of permissions by role
          </p>
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[300px]'>Permission</TableHead>
                {roles.map(role => (
                  <TableHead key={role} className='text-center min-w-[100px]'>
                    {role}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map(perm => (
                <TableRow key={perm}>
                  <TableCell className='font-medium text-sm'>{perm}</TableCell>
                  {roles.map(role => {
                    const hasPerm = permissionsMap[role]?.includes(perm);
                    return (
                      <TableCell key={role} className='text-center'>
                        {hasPerm ? (
                          <div className='flex justify-center'>
                            <CheckCircle2 className='w-5 h-5 text-green-500' />
                          </div>
                        ) : (
                          <div className='flex justify-center'>
                            <XCircle className='w-5 h-5 text-muted-foreground/30' />
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

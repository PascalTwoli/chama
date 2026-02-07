import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  ArrowLeft,
  Shield,
  Edit,
  User,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

interface MemberRolesPageProps {
  onBack: () => void;
  role: 'admin' | 'member';
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'treasurer' | 'secretary' | 'auditor' | 'member';
  joinedDate: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  roles: {
    admin: boolean;
    treasurer: boolean;
    secretary: boolean;
    auditor: boolean;
    member: boolean;
  };
}

export default function MemberRolesPage({ onBack, role }: MemberRolesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditRole, setShowEditRole] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newRole, setNewRole] = useState<Member['role']>('member');

  // Mock data
  const members: Member[] = [
    {
      id: '1',
      name: 'John Kamau',
      email: 'john.kamau@email.com',
      phone: '0712345678',
      role: 'admin',
      joinedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Mary Wanjiku',
      email: 'mary.wanjiku@email.com',
      phone: '0723456789',
      role: 'treasurer',
      joinedDate: '2024-01-15'
    },
    {
      id: '3',
      name: 'Sarah Njeri',
      email: 'sarah.njeri@email.com',
      phone: '0734567890',
      role: 'secretary',
      joinedDate: '2024-02-20'
    },
    {
      id: '4',
      name: 'Grace Akinyi',
      email: 'grace.akinyi@email.com',
      phone: '0745678901',
      role: 'auditor',
      joinedDate: '2024-03-10'
    },
    {
      id: '5',
      name: 'Peter Ochieng',
      email: 'peter.ochieng@email.com',
      phone: '0756789012',
      role: 'member',
      joinedDate: '2024-04-05'
    },
    {
      id: '6',
      name: 'David Mwangi',
      email: 'david.mwangi@email.com',
      phone: '0767890123',
      role: 'member',
      joinedDate: '2024-05-12'
    },
    {
      id: '7',
      name: 'James Omondi',
      email: 'james.omondi@email.com',
      phone: '0778901234',
      role: 'member',
      joinedDate: '2024-06-18'
    },
    {
      id: '8',
      name: 'Anne Chebet',
      email: 'anne.chebet@email.com',
      phone: '0789012345',
      role: 'member',
      joinedDate: '2024-07-22'
    },
    {
      id: '9',
      name: 'Paul Kiptoo',
      email: 'paul.kiptoo@email.com',
      phone: '0790123456',
      role: 'member',
      joinedDate: '2024-08-30'
    },
    {
      id: '10',
      name: 'Lucy Muthoni',
      email: 'lucy.muthoni@email.com',
      phone: '0701234567',
      role: 'member',
      joinedDate: '2024-09-14'
    }
  ];

  const permissions: Permission[] = [
    {
      id: '1',
      name: 'View Financial Reports',
      description: 'Access to all financial reports and analytics',
      roles: { admin: true, treasurer: true, secretary: true, auditor: true, member: true }
    },
    {
      id: '2',
      name: 'Record Contributions',
      description: 'Add and edit member contributions',
      roles: { admin: true, treasurer: true, secretary: false, auditor: false, member: false }
    },
    {
      id: '3',
      name: 'Record Expenses',
      description: 'Add and manage Chama expenses',
      roles: { admin: true, treasurer: true, secretary: false, auditor: false, member: false }
    },
    {
      id: '4',
      name: 'Issue Loans',
      description: 'Approve and disburse member loans',
      roles: { admin: true, treasurer: true, secretary: false, auditor: false, member: false }
    },
    {
      id: '5',
      name: 'Add/Remove Members',
      description: 'Manage Chama membership',
      roles: { admin: true, treasurer: false, secretary: true, auditor: false, member: false }
    },
    {
      id: '6',
      name: 'Change Member Roles',
      description: 'Assign and modify member permissions',
      roles: { admin: true, treasurer: false, secretary: false, auditor: false, member: false }
    },
    {
      id: '7',
      name: 'Modify Chama Settings',
      description: 'Edit Chama rules and configurations',
      roles: { admin: true, treasurer: false, secretary: false, auditor: false, member: false }
    },
    {
      id: '8',
      name: 'Schedule Meetings',
      description: 'Create and manage meeting schedules',
      roles: { admin: true, treasurer: false, secretary: true, auditor: false, member: false }
    },
    {
      id: '9',
      name: 'Send Announcements',
      description: 'Broadcast messages to all members',
      roles: { admin: true, treasurer: false, secretary: true, auditor: false, member: false }
    },
    {
      id: '10',
      name: 'Audit Financial Records',
      description: 'Review and verify all transactions',
      roles: { admin: true, treasurer: false, secretary: false, auditor: true, member: false }
    },
    {
      id: '11',
      name: 'View Activity Log',
      description: 'Access complete audit trail',
      roles: { admin: true, treasurer: true, secretary: false, auditor: true, member: false }
    },
    {
      id: '12',
      name: 'Generate Reports',
      description: 'Create custom financial reports',
      roles: { admin: true, treasurer: true, secretary: false, auditor: true, member: false }
    }
  ];

  const roleInfo = {
    admin: {
      name: 'Admin',
      color: 'bg-primary/10 text-primary border-primary/20',
      description: 'Full access to all Chama features and settings'
    },
    treasurer: {
      name: 'Treasurer',
      color: 'bg-secondary/10 text-secondary border-secondary/20',
      description: 'Manages finances, contributions, expenses, and loans'
    },
    secretary: {
      name: 'Secretary',
      color: 'bg-accent/10 text-accent border-accent/20',
      description: 'Manages membership, meetings, and communications'
    },
    auditor: {
      name: 'Auditor',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Reviews financial records and generates audit reports'
    },
    member: {
      name: 'Regular Member',
      color: 'bg-muted text-muted-foreground border-border',
      description: 'View reports and make contributions'
    }
  };

  // Filter members
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count members by role
  const roleCounts = members.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleEditRole = (member: Member) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setShowEditRole(true);
  };

  const handleSaveRole = () => {
    if (selectedMember) {
      toast.success(`Updated ${selectedMember.name}'s role to ${roleInfo[newRole].name}`);
      setShowEditRole(false);
      setSelectedMember(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Member Roles & Permissions</h1>
            <p className="text-sm text-muted-foreground">Manage member access and responsibilities</p>
          </div>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(roleInfo).map(([role, info]) => (
          <Card key={role}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">{roleCounts[role] || 0}</p>
                <p className="text-sm text-muted-foreground">{info.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Member Roles</CardTitle>
          <CardDescription>Assign and manage member permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{member.phone}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={roleInfo[member.role].color}>
                        <Shield className="w-3 h-3 mr-1" />
                        {roleInfo[member.role].name}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(member.joinedDate).toLocaleDateString('en-KE', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(member)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="border">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.phone}</p>
                      </div>
                      <Badge variant="outline" className={roleInfo[member.role].color}>
                        {roleInfo[member.role].name}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleEditRole(member)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
          <CardDescription>Overview of permissions by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Permission</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Admin</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Treasurer</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Secretary</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Auditor</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-sm">{permission.name}</p>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {permission.roles.admin ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground mx-auto opacity-30" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {permission.roles.treasurer ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground mx-auto opacity-30" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {permission.roles.secretary ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground mx-auto opacity-30" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {permission.roles.auditor ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground mx-auto opacity-30" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {permission.roles.member ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground mx-auto opacity-30" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={showEditRole} onOpenChange={setShowEditRole}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update {selectedMember?.name}'s role and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedMember?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">New Role</label>
              <div className="space-y-2">
                {Object.entries(roleInfo).map(([role, info]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setNewRole(role as Member['role'])}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      newRole === role
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          borderColor: newRole === role ? '#2F7CF7' : '#e0e0e0',
                          backgroundColor: newRole === role ? '#2F7CF7' : 'transparent'
                        }}
                      >
                        {newRole === role && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{info.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRole(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
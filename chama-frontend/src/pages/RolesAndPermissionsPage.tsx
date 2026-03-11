/* eslint-disable prettier/prettier */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Shield, Search, Edit2, CheckCircle2, XCircle, Plus, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { Card, CardContent } from '../components/ui/card';
import { useChamaId } from '../hooks/useChamaId';
import RolesPermissionsService, {
  type Role,
  type Permission,
  type PermissionsMatrix,
  type RoleStats,
} from '../services/roles-permissions/roles-permissions-service';
import ChamaMembersService, {
  type ChamaMember,
} from '../services/chama/chama-members-service';

interface MemberWithRole extends ChamaMember {
  orgRoleName: string;
  orgRoleId: string;
}

const DEFAULT_STAT_KEYS = [
  { key: 'chairperson', label: 'Chairperson' },
  { key: 'treasurer', label: 'Treasurer' },
  { key: 'secretary', label: 'Secretary' },
  { key: 'auditor', label: 'Auditor' },
  { key: 'general_member', label: 'General Member' },
];

function formatPermissionLabel(key: string): string {
  return key
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function RolesAndPermissionsPage() {
  const { chamaId } = useChamaId();

  // Data state
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [matrix, setMatrix] = useState<PermissionsMatrix | null>(null);
  const [stats, setStats] = useState<RoleStats>({});
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Role Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<MemberWithRole | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [savingRole, setSavingRole] = useState(false);

  // Create Role Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [creatingRole, setCreatingRole] = useState(false);

  // Edit Role Permissions Modal
  const [editPermModalOpen, setEditPermModalOpen] = useState(false);
  const [editPermRole, setEditPermRole] = useState<Role | null>(null);
  const [editPermName, setEditPermName] = useState('');
  const [editPermDescription, setEditPermDescription] = useState('');
  const [editPermKeys, setEditPermKeys] = useState<string[]>([]);
  const [savingPerms, setSavingPerms] = useState(false);

  const loadPageData = useCallback(async () => {
    if (!chamaId) return;
    setLoading(true);
    try {
      const [rolesData, matrixData, statsData, membersData, permissionsData] =
        await Promise.all([
          RolesPermissionsService.getRoles(chamaId),
          RolesPermissionsService.getPermissionsMatrix(chamaId),
          RolesPermissionsService.getRoleStats(chamaId),
          ChamaMembersService.getChamaMembers(chamaId),
          RolesPermissionsService.getPermissions(),
        ]);

      setRoles(rolesData);
      setMatrix(matrixData);
      setStats(statsData);
      setAllPermissions(permissionsData);

      // Map members to their organizational role — prefer RBAC orgRole, fall back to legacy
      const membersWithRoles: MemberWithRole[] = membersData.map(m => {
        if (m.orgRole) {
          return {
            ...m,
            orgRoleName: m.orgRole.name,
            orgRoleId: m.orgRole.id,
          };
        }
        // Fallback: derive from legacy membership.role field
        const legacyRoleName = m.role === 'CHAIRPERSON' ? 'Chairperson'
          : m.role === 'TREASURER' ? 'Treasurer'
          : m.role === 'SECRETARY' ? 'Secretary'
          : 'General Member';
        const matchedRole = rolesData.find(r => r.name === legacyRoleName);
        return {
          ...m,
          orgRoleName: matchedRole?.name || legacyRoleName,
          orgRoleId: matchedRole?.id || '',
        };
      });

      setMembers(membersWithRoles);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to load roles data'
      );
    } finally {
      setLoading(false);
    }
  }, [chamaId]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  // ─── Edit Role Modal handlers ─────────────────────────────────

  const openEditModal = (member: MemberWithRole) => {
    setEditMember(member);
    setSelectedRoleId(member.orgRoleId);
    setEditModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!chamaId || !editMember || !selectedRoleId) return;
    setSavingRole(true);
    try {
      await RolesPermissionsService.assignMemberRole(
        editMember.userId,
        chamaId,
        selectedRoleId
      );
      toast.success('Role updated successfully');
      setEditModalOpen(false);
      await loadPageData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update role'
      );
    } finally {
      setSavingRole(false);
    }
  };

  // ─── Create Role Modal handlers ───────────────────────────────

  const openCreateModal = async () => {
    setNewRoleName('');
    setNewRoleDescription('');
    setNewRolePermissions([]);
    setCreateModalOpen(true);
  };

  const toggleNewRolePermission = (key: string) => {
    setNewRolePermissions(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleCreateRole = async () => {
    if (!chamaId || !newRoleName.trim()) return;
    setCreatingRole(true);
    try {
      await RolesPermissionsService.createRole(chamaId, {
        name: newRoleName.trim(),
        description: newRoleDescription.trim() || undefined,
        permissions: newRolePermissions,
      });
      toast.success('Role created successfully');
      setCreateModalOpen(false);
      await loadPageData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create role'
      );
    } finally {
      setCreatingRole(false);
    }
  };

  // ─── Edit Role Permissions Modal handlers ─────────────────────

  const openEditPermModal = (role: Role) => {
    setEditPermRole(role);
    setEditPermName(role.name);
    setEditPermDescription(role.description || '');
    setEditPermKeys(role.role_permissions.map(rp => rp.permission.key));
    setEditPermModalOpen(true);
  };

  const toggleEditPermKey = (key: string) => {
    setEditPermKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSavePermissions = async () => {
    if (!chamaId || !editPermRole) return;
    setSavingPerms(true);
    try {
      await RolesPermissionsService.updateRole(editPermRole.id, chamaId, {
        name: editPermName.trim() || undefined,
        description: editPermDescription.trim() || undefined,
        permissions: editPermKeys,
      });
      toast.success('Role permissions updated successfully');
      setEditPermModalOpen(false);
      await loadPageData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update permissions'
      );
    } finally {
      setSavingPerms(false);
    }
  };

  // ─── UI helpers ───────────────────────────────────────────────

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      Chairperson: 'bg-blue-100 text-blue-800 border-blue-200',
      Treasurer: 'bg-green-100 text-green-800 border-green-200',
      Secretary: 'bg-orange-100 text-orange-800 border-orange-200',
      Auditor: 'bg-purple-100 text-purple-800 border-purple-200',
      'General Member': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
      <span
        className={cn(
          'px-2.5 py-0.5 rounded-full text-xs font-medium border',
          styles[role] || styles['General Member']
        )}
      >
        {role}
      </span>
    );
  };

  const filteredMembers = members.filter(m => {
    const name = m.user?.name?.toLowerCase() || '';
    const email = m.user?.email?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  if (loading) {
    return (
      <div className='p-6 flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='p-6 space-y-8'>
      <PageHeader
        title='Member Roles & Permissions'
        subtitle='Manage member access and responsibilities'
        action={
          <Button
            size='sm'
            className='gap-2'
            onClick={openCreateModal}
          >
            <Plus className='w-4 h-4' />
            Create Role
          </Button>
        }
      />

      {/* Role Counts Cards */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {DEFAULT_STAT_KEYS.map(rc => (
          <Card key={rc.key} className='text-center'>
            <CardContent className='p-6 flex flex-col items-center gap-2'>
              <div className='w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1'>
                <Shield className='w-5 h-5' />
              </div>
              <h3 className='text-2xl font-bold m-0'>{stats[rc.key] ?? 0}</h3>
              <p className='text-xs text-muted-foreground font-medium uppercase tracking-wider m-0'>
                {rc.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Roles Section */}
      <div className='bg-card rounded-lg border border-border shadow-sm pb-4'>
        <div className='p-6 space-y-4'>
          <div>
            <h3 className='font-semibold text-lg m-0'>Member Roles</h3>
            <p className='text-sm text-muted-foreground m-0'>
              Assign and manage member permissions
            </p>
          </div>

          <div className='relative max-w-full'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search members...'
              className='pl-9'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className='px-6'>
          <Table className='border-collapse'>
            <TableHeader className='bg-muted/50'>
              <TableRow className='hover:bg-transparent border-b border-border'>
                <TableHead>Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map(member => (
                <TableRow
                  key={member.id}
                  className='hover:bg-muted/50 transition-colors border-0'
                >
                  <TableCell className='border-b border-border py-3'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium'>
                        {(member.user?.name || '?')
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className='font-medium text-sm m-0'>{member.user?.name || 'Unknown'}</p>
                        <p className='text-xs text-muted-foreground m-0'>
                          {member.user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='border-b border-border py-3'>
                    {member.user?.phone || '-'}
                  </TableCell>
                  <TableCell className='border-b border-border py-3'>
                    {getRoleBadge(member.orgRoleName)}
                  </TableCell>
                  {/* eslint-disable-next-line prettier/prettier */}
                  <TableCell className='text-muted-foreground border-b border-border py-3'>
                    {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className='text-right border-b border-border py-3'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-2 h-8'
                      onClick={() => openEditModal(member)}
                    >
                      <Edit2 className='w-3 h-3' />
                      Edit Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Permissions Matrix Section */}
      <div className='bg-card rounded-lg border border-border shadow-sm pb-4'>
        <div className='p-6'>
          <h3 className='font-semibold text-lg m-0'>Permissions Matrix</h3>
          <p className='text-sm text-muted-foreground m-0'>
            Overview of permissions by role
          </p>
        </div>
        <div className='overflow-x-auto px-6'>
          {matrix && (
            <Table className='border-collapse'>
              <TableHeader className='bg-muted/50'>
                <TableRow className='hover:bg-transparent border-b border-border'>
                  <TableHead className='w-[300px]'>Permission</TableHead>
                  {matrix.roles.map(role => (
                    <TableHead key={role.id} className='text-center min-w-[100px]'>
                      <button
                        type='button'
                        className='hover:underline cursor-pointer bg-transparent border-0 p-0 font-medium text-sm text-inherit'
                        onClick={() => {
                          const fullRole = roles.find(r => r.id === role.id);
                          if (fullRole && !fullRole.is_default) {
                            openEditPermModal(fullRole);
                          }
                        }}
                        title={!roles.find(r => r.id === role.id)?.is_default ? 'Click to edit permissions' : role.name}
                      >
                        {role.name}
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrix.permissions.map(perm => (
                  <TableRow
                    key={perm.id}
                    className='hover:bg-muted/50 transition-colors border-0'
                  >
                    <TableCell className='font-medium text-sm border-b border-border py-3'>
                      {formatPermissionLabel(perm.key)}
                    </TableCell>
                    {matrix.roles.map(role => {
                      const hasPerm = matrix.matrix[role.id]?.[perm.key];
                      return (
                        <TableCell
                          key={role.id}
                          className='text-center border-b border-border py-3'
                        >
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
          )}
        </div>
      </div>

      {/* ─── Edit Role Modal ─────────────────────────────────────── */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update {editMember?.user?.name || 'member'}&apos;s role and permissions
            </DialogDescription>
          </DialogHeader>

          {editMember && (
            <div className='bg-muted/50 rounded-lg p-4 flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium'>
                {(editMember.user?.name || '?')
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </div>
              <div>
                <p className='font-medium text-sm m-0'>{editMember.user?.name}</p>
                <p className='text-xs text-muted-foreground m-0'>
                  {editMember.user?.email}
                </p>
              </div>
            </div>
          )}

          <div className='space-y-2'>
            <Label className='text-sm font-medium'>New Role</Label>
            <div className='space-y-2 max-h-[300px] overflow-y-auto'>
              {roles.map(role => (
                <label
                  key={role.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedRoleId === role.id
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-border hover:bg-muted/50'
                  )}
                >
                  <input
                    type='radio'
                    name='memberRole'
                    value={role.id}
                    checked={selectedRoleId === role.id}
                    onChange={() => setSelectedRoleId(role.id)}
                    className='mt-1'
                  />
                  <div>
                    <p className='font-medium text-sm m-0'>{role.name}</p>
                    <p className='text-xs text-muted-foreground m-0'>
                      {role.description || ''}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole} disabled={savingRole || !selectedRoleId}>
              {savingRole && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Create Role Modal ───────────────────────────────────── */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Create Custom Role</DialogTitle>
            <DialogDescription>
              Define a new organizational role with specific permissions
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='roleName'>Role Name</Label>
              <Input
                id='roleName'
                placeholder='e.g. Loan Officer'
                value={newRoleName}
                onChange={e => setNewRoleName(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='roleDesc'>Description</Label>
              <Input
                id='roleDesc'
                placeholder='Brief description of this role'
                value={newRoleDescription}
                onChange={e => setNewRoleDescription(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label>Permissions</Label>
              <div className='space-y-2 max-h-[250px] overflow-y-auto border rounded-lg p-3'>
                {allPermissions.map(perm => (
                  <label
                    key={perm.id}
                    className='flex items-center gap-3 py-1 cursor-pointer'
                  >
                    <Checkbox
                      checked={newRolePermissions.includes(perm.key)}
                      onCheckedChange={() => toggleNewRolePermission(perm.key)}
                    />
                    <span className='text-sm'>
                      {formatPermissionLabel(perm.key)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateRole}
              disabled={creatingRole || !newRoleName.trim()}
            >
              {creatingRole && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Role Permissions Modal ─────────────────────────── */}
      <Dialog open={editPermModalOpen} onOpenChange={setEditPermModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Role Permissions</DialogTitle>
            <DialogDescription>
              Update permissions for {editPermRole?.name || 'role'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='editRoleName'>Role Name</Label>
              <Input
                id='editRoleName'
                value={editPermName}
                onChange={e => setEditPermName(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='editRoleDesc'>Description</Label>
              <Input
                id='editRoleDesc'
                value={editPermDescription}
                onChange={e => setEditPermDescription(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label>Permissions</Label>
              <div className='space-y-2 max-h-[250px] overflow-y-auto border rounded-lg p-3'>
                {allPermissions.map(perm => (
                  <label
                    key={perm.id}
                    className='flex items-center gap-3 py-1 cursor-pointer'
                  >
                    <Checkbox
                      checked={editPermKeys.includes(perm.key)}
                      onCheckedChange={() => toggleEditPermKey(perm.key)}
                    />
                    <span className='text-sm'>
                      {formatPermissionLabel(perm.key)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setEditPermModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={savingPerms}>
              {savingPerms && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

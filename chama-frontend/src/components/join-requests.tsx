/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  Loader2,
  MoreVertical,
  Phone,
  Eye,
  X,
  MessageSquare,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PageHeader } from './PageHeader';
import { Badge } from './ui/badge';
import { useParams } from 'react-router-dom';
import ChamaService from '../services/chama/chama-services';
import { toast } from 'react-toastify';

interface JoinRequest {
  id: string;
  chamaId: string;
  userId: string;
  status: string;
  message?: string;
  createdAt: string;
  updatedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  chama?: {
    id: string;
    name: string;
    description?: string;
  };
}

const JoinRequests = () => {
  const { chamaId } = useParams<{ chamaId: string }>();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [reviewModalRequest, setReviewModalRequest] =
    useState<JoinRequest | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchPendingRequests = useCallback(async () => {
    if (!chamaId) return;

    try {
      setLoading(true);
      const data = await ChamaService.getPendingJoinRequests(chamaId);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch join requests', error);
      toast.error('Failed to load join requests');
    } finally {
      setLoading(false);
    }
  }, [chamaId]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApprove = async (requestId: string) => {
    if (!chamaId) return;

    try {
      setActionLoading(requestId);
      setOpenDropdownId(null);
      setReviewModalRequest(null);
      await ChamaService.reviewJoinRequest(chamaId, requestId, 'approve');
      toast.success('Join request approved successfully');
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Failed to approve request', error);
      toast.error('Failed to approve join request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!chamaId) return;

    try {
      setActionLoading(requestId);
      setOpenDropdownId(null);
      setReviewModalRequest(null);
      await ChamaService.reviewJoinRequest(chamaId, requestId, 'reject');
      toast.success('Join request rejected');
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Failed to reject request', error);
      toast.error('Failed to reject join request');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) {
      return <Badge variant='secondary'>Unknown</Badge>;
    }
    switch (status.toUpperCase()) {
      case 'PENDING':
        return (
          <Badge className='gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'>
            <Clock className='w-3 h-3' />
            Pending
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge className='gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
            <CheckCircle className='w-3 h-3' />
            Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant='destructive' className='gap-1'>
            <XCircle className='w-3 h-3' />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant='secondary'>{status}</Badge>;
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return (
      name
        .split(' ')
        .filter(n => n.length > 0)
        .map(n => n[0] || '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    );
  };

  const toggleDropdown = (requestId: string) => {
    setOpenDropdownId(openDropdownId === requestId ? null : requestId);
  };

  return (
    <div className='p-6 space-y-6 max-w-[1600px] mx-auto'>
      <PageHeader
        title='Join Requests'
        subtitle='Review and manage pending membership requests'
        showBackButton
      />

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='w-5 h-5 text-amber-500' />
            Pending Join Requests
            {requests.length > 0 && (
              <Badge variant='secondary' className='ml-2'>
                {requests.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
            </div>
          ) : requests.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center'>
                <User className='w-8 h-8 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                No Pending Requests
              </h3>
              <p className='text-muted-foreground'>
                There are no pending join requests at the moment.
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {requests.map(request => (
                <div
                  key={request.id}
                  className='flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors'
                >
                  {/* Left side - User Info */}
                  <div className='flex items-center gap-4 flex-1 min-w-0'>
                    {/* Avatar */}
                    <div
                      className='w-11 h-11 rounded-full flex items-center justify-center font-semibold flex-shrink-0'
                      style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                      }}
                    >
                      {getInitials(request.user?.name)}
                    </div>

                    {/* User Details */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <h4 className='font-semibold text-foreground truncate m-0'>
                          {request.user?.name || 'Unknown User'}
                        </h4>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className='flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap'>
                        {request.user?.email && (
                          <span className='flex items-center gap-1.5'>
                            <Mail className='w-3.5 h-3.5' />
                            <span className='truncate max-w-[200px]'>
                              {request.user.email}
                            </span>
                          </span>
                        )}
                        {request.user?.phoneNumber && (
                          <span className='flex items-center gap-1.5'>
                            <Phone className='w-3.5 h-3.5' />
                            {request.user.phoneNumber}
                          </span>
                        )}
                        <span className='flex items-center gap-1.5'>
                          <Clock className='w-3.5 h-3.5' />
                          {getTimeAgo(request.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  {request.status?.toUpperCase() === 'PENDING' && (
                    <div
                      className='relative flex-shrink-0 ml-4'
                      ref={openDropdownId === request.id ? dropdownRef : null}
                    >
                      <button
                        className='p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground bg-transparent border-1px border-transparent hover:border-input'
                        onClick={() => toggleDropdown(request.id)}
                        disabled={actionLoading === request.id}
                      >
                        {actionLoading === request.id ? (
                          <Loader2 className='w-5 h-5 animate-spin' />
                        ) : (
                          <MoreVertical className='w-5 h-5' />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdownId === request.id && (
                        <div
                          className='absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl z-50 overflow-hidden'
                          style={{
                            backgroundColor: 'var(--card)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: 'var(--border)',
                          }}
                        >
                          <div className='py-1'>
                            <button
                              className='w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:opacity-80'
                              style={{
                                backgroundColor: 'transparent',
                                color: 'var(--success)',
                              }}
                              onMouseEnter={e =>
                                (e.currentTarget.style.backgroundColor =
                                  'var(--muted)')
                              }
                              onMouseLeave={e =>
                                (e.currentTarget.style.backgroundColor =
                                  'transparent')
                              }
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className='w-4 h-4' />
                              Approve Request
                            </button>
                            <button
                              className='w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors'
                              style={{
                                backgroundColor: 'transparent',
                                color: 'var(--destructive)',
                              }}
                              onMouseEnter={e =>
                                (e.currentTarget.style.backgroundColor =
                                  'var(--muted)')
                              }
                              onMouseLeave={e =>
                                (e.currentTarget.style.backgroundColor =
                                  'transparent')
                              }
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className='w-4 h-4' />
                              Reject Request
                            </button>
                            <div
                              style={{
                                borderTop: '1px solid var(--border)',
                                margin: '4px 0',
                              }}
                            />
                            <button
                              className='w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors'
                              style={{
                                backgroundColor: 'transparent',
                                color: 'var(--foreground)',
                              }}
                              onMouseEnter={e =>
                                (e.currentTarget.style.backgroundColor =
                                  'var(--muted)')
                              }
                              onMouseLeave={e =>
                                (e.currentTarget.style.backgroundColor =
                                  'transparent')
                              }
                              onClick={() => {
                                setReviewModalRequest(request);
                                setOpenDropdownId(null);
                              }}
                            >
                              <Eye className='w-4 h-4' />
                              View Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className='bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'>
        <CardContent className='pt-6'>
          <div className='flex gap-4'>
            <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0'>
              <User className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div className='space-y-1'>
              <h4 className='font-semibold text-blue-900 dark:text-blue-100 m-0'>
                About Join Requests
              </h4>
              <p className='text-sm text-blue-700 dark:text-blue-300 m-0'>
                When users discover your Chama and request to join, their
                requests will appear here. As a chairperson, you can approve or
                reject these requests. Approved members will automatically be
                added to your Chama.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {reviewModalRequest && (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50'>
          <div
            className='rounded-xl shadow-2xl w-full max-w-lg'
            style={{ backgroundColor: 'var(--card)' }}
          >
            {/* Modal Header */}
            <div
              className='flex items-center justify-between p-6'
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h2
                className='text-xl font-semibold m-0 py-2'
                style={{ color: 'var(--foreground)' }}
              >
                Request Details
              </h2>
              <button
                className='p-2 rounded-lg transition-colors'
                style={{ color: 'var(--muted-foreground)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                }}
                onClick={() => setReviewModalRequest(null)}
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Modal Body */}
            <div className='p-6 space-y-6'>
              {/* User Info Section */}
              <div className='flex items-start gap-4'>
                <div
                  className='w-14 h-14 rounded-full flex items-center justify-center font-semibold text-xl'
                  style={{
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                  }}
                >
                  {getInitials(reviewModalRequest.user?.name)}
                </div>
                <div className='flex-1'>
                  <h3
                    className='text-lg font-semibold m-0'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {reviewModalRequest.user?.name || 'Unknown User'}
                  </h3>
                  <div className='m-0'>
                    {getStatusBadge(reviewModalRequest.status)}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className='grid gap-4'>
                {reviewModalRequest.user?.email && (
                  <div
                    className='flex items-center gap-3 p-3 rounded-lg'
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <Mail
                      className='w-5 h-5'
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                    <div>
                      <p
                        className='text-xs m-0'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        Email
                      </p>
                      <p
                        className='font-medium m-0'
                        style={{ color: 'var(--foreground)' }}
                      >
                        {reviewModalRequest.user.email}
                      </p>
                    </div>
                  </div>
                )}

                {reviewModalRequest.user?.phoneNumber && (
                  <div
                    className='flex items-center gap-3 p-3 rounded-lg'
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <Phone
                      className='w-5 h-5'
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                    <div>
                      <p
                        className='text-xs m-0'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        Phone Number
                      </p>
                      <p
                        className='font-medium m-0'
                        style={{ color: 'var(--foreground)' }}
                      >
                        {reviewModalRequest.user.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className='flex items-center gap-3 p-3 rounded-lg'
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <Calendar
                    className='w-5 h-5'
                    style={{ color: 'var(--muted-foreground)' }}
                  />
                  <div>
                    <p
                      className='text-xs m-0'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Request Submitted
                    </p>
                    <p
                      className='font-medium m-0'
                      style={{ color: 'var(--foreground)' }}
                    >
                      {formatDate(reviewModalRequest.createdAt)}
                    </p>
                  </div>
                </div>

                {reviewModalRequest.message && (
                  <div
                    className='flex items-start gap-3 p-3 rounded-lg'
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <MessageSquare
                      className='w-5 h-5 mt-0.5'
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                    <div>
                      <p
                        className='text-xs m-0'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        Message
                      </p>
                      <p
                        className='font-medium italic m-0'
                        style={{ color: 'var(--foreground)' }}
                      >
                        "{reviewModalRequest.message}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            {reviewModalRequest.status?.toUpperCase() === 'PENDING' && (
              <div
                className='flex items-center gap-3 p-6'
                style={{
                  borderTop: '1px solid var(--border)',
                  backgroundColor: 'var(--muted)',
                }}
              >
                <button
                  className='flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors'
                  style={{
                    border: '1px solid var(--border)',
                    color: 'var(--destructive)',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.backgroundColor =
                      'rgba(220, 38, 38, 0.1)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                  onClick={() => handleReject(reviewModalRequest.id)}
                  disabled={actionLoading === reviewModalRequest.id}
                >
                  {actionLoading === reviewModalRequest.id ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <XCircle className='w-4 h-4' />
                  )}
                  Reject
                </button>
                <button
                  className='flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors border-0'
                  style={{
                    backgroundColor: 'var(--success)',
                    color: 'var(--success-foreground)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  onClick={() => handleApprove(reviewModalRequest.id)}
                  disabled={actionLoading === reviewModalRequest.id}
                >
                  {actionLoading === reviewModalRequest.id ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <CheckCircle className='w-4 h-4' />
                  )}
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRequests;

import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface InviteLinkProps {
  chamaId: string;
  chamaName: string;
}

/**
 * Component for generating and sharing invite links
 * 
 * This component provides functionality for admins to:
 * 1. Generate an invite link for a specific email
 * 2. Copy the link to clipboard
 * 3. Optionally send the invite via email
 */
function InviteLink({ chamaId, chamaName }: InviteLinkProps) {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const toast = useRef<Toast>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate an invitation link
  const generateInviteLink = async () => {
    if (!email || !email.includes('@')) {
      toast.current?.show({
        severity: 'error',
        summary: 'Invalid Email',
        detail: 'Please enter a valid email address',
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/invites/create', {
        chamaId,
        email,
        sendEmail
      });
      
      setInviteLink(response.data.inviteLink);
      setShowDialog(true);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Invite Link Generated',
        detail: sendEmail 
          ? `Invitation sent to ${email}` 
          : `Invitation link ready to share with ${email}`,
        life: 3000,
      });
    } catch (error: unknown) {
      console.error('Error generating invite link:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: ((error as ApiError).response?.data?.message) || 'Failed to generate invite link',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy invite link to clipboard
  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      
      toast.current?.show({
        severity: 'info',
        summary: 'Copied!',
        detail: 'Invite link copied to clipboard',
        life: 2000,
      });
    }
  };

  // Dialog footer with copy button
  const dialogFooter = (
    <div className="flex justify-content-end">
      <Button 
        label="Copy & Close" 
        icon="pi pi-copy" 
        onClick={() => {
          copyToClipboard();
          setShowDialog(false);
        }} 
        className="p-button-success" 
      />
    </div>
  );

  return (
    <div className="p-4 bg-gray-800 rounded-lg mb-4">
      <Toast ref={toast} />
      
      <h3 className="text-white text-lg font-bold mb-3">Invite Member to {chamaName}</h3>
      
      <div className="flex flex-column sm:flex-row gap-3 mb-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-envelope"></i>
          </span>
          <InputText
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            label="Generate Link"
            icon="pi pi-link"
            loading={loading}
            onClick={generateInviteLink}
            className="p-button-primary"
          />
        </div>
      </div>
      
      <div className="flex align-items-center">
        <div className="p-field-checkbox">
          <input 
            type="checkbox" 
            id="sendEmail" 
            checked={sendEmail} 
            onChange={(e) => setSendEmail(e.target.checked)} 
            className="mr-2"
          />
          <label htmlFor="sendEmail" className="text-gray-300">Also send invitation email</label>
        </div>
      </div>
      
      <Dialog
        header="Invitation Link Generated"
        visible={showDialog}
        style={{ width: '90%', maxWidth: '550px' }}
        onHide={() => setShowDialog(false)}
        footer={dialogFooter}
      >
        <div className="p-3">
          <p className="mb-3">Share this link with {email}:</p>
          <div className="p-inputgroup">
            <InputText
              ref={inputRef}
              value={inviteLink}
              readOnly
              className="w-full font-mono text-sm"
            />
            <Button
              icon="pi pi-copy"
              onClick={copyToClipboard}
              tooltip="Copy to clipboard"
              tooltipOptions={{ position: 'top' }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            This link will expire in 7 days and is specific to the email address you entered.
          </p>
        </div>
      </Dialog>
    </div>
  );
}

export default InviteLink;


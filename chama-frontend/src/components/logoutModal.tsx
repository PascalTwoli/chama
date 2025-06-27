import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import logoutUser from '../services/auth/logout';
import { useNavigate } from 'react-router-dom';

interface LogoutModalProps {
  visible: boolean;
  onHide: () => void;
}

export default function LogoutModal({ visible, onHide }: LogoutModalProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      onHide();
      // The logoutUser function now handles the navigation
    } catch (error) {
      console.error('Logout failed:', error);
      // If logout fails, try to clear localStorage and redirect anyway
      localStorage.clear();
      navigate('/signin');
      onHide();
    }
  };

  const footerContent = (
    <div>
      <Button
        label='Cancel'
        icon='pi pi-times'
        onClick={onHide}
        className='p-button-text'
      />
      <Button
        label='Logout'
        icon='pi pi-check'
        onClick={handleLogout}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header='Confirm Logout'
      visible={visible}
      style={{ width: '50vw' }}
      onHide={onHide}
      footer={footerContent}
    >
      <p className='m-0'>Are you sure you want to log out?</p>
    </Dialog>
  );
}

import React, { useState } from 'react';
import { Menu } from 'primereact/menu';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
type Role = 'Chair' | 'Secretary' | 'Treasurer';

interface ChamaSettingsProps {
  chamaId?: string;
  chamaName?: string;
}

const ChamaSettings: React.FC<ChamaSettingsProps> = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('Account');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roleProfile, setRoleProfile] = useState<Record<Role, string | null>>({
    Chair: null,
    Secretary: null,
    Treasurer: null,
  });

  const [roleNames, setRoleNames] = useState<Record<Role, string>>({
    Chair: 'Agustine',
    Secretary: 'Pascal',
    Treasurer: 'Daniel',
  });

  const handleNameChange = (role: Role, newName: string) => {
    setRoleNames(prev => ({ ...prev, [role]: newName }));
  };

  const handleSaveAccountChanges = () => {
    setIsEditing(false);
  };

  const renderRoleProfile = (role: Role) => (
    <div className='leadership-roles flex flex-col items-center gap-2 text-center text-gray-300 p-2'>
      <h4 className='text-md w-full border pb-2 mb-2 mt-2 font-bold'>{role}</h4>
      <label htmlFor={`${role}-upload`}>
        <div
          className={`w-36 h-36 bg-gray-800 border-2 border-gray-600 hover:border-blue-400 transition-all duration-200 rounded-full flex items-center justify-center overflow-hidden ${isEditing ? 'cursor-pointer profileEditing' : 'cursor-not-allowed opacity-90'}`}
        >
          {roleProfile[role] ? (
            <img
              src={roleProfile[role]!}
              alt={`${role}`}
              className='object-cover w-full h-full'
            />
          ) : (
            <span className='text-sm'>{`Upload ${role} Image`}</span>
          )}
        </div>
      </label>
      <input
        id={`${role}-upload`}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={e => handleRoleImageUpload(e, role)}
        disabled={!isEditing}
      />
      <InputText
        value={roleNames[role]}
        onChange={e => handleNameChange(role, e.target.value)}
        className='text-center text-xl font-semibold text-white bg-transparent border-none rounded'
        disabled={!isEditing}
      />
    </div>
  );

  const handleRoleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    role: Role
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, etc.)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoleProfile(prev => ({
          ...prev,
          [role]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, etc.)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    {
      label: 'Settings',
      items: [
        {
          label: 'Account',
          command: () => setActiveTab('Account'),
        },
        {
          label: 'Leadership',
          command: () => setActiveTab('Leadership'),
        },
        {
          label: 'Danger Zone',
          command: () => setActiveTab('Danger Zone'),
        },
      ],
    },
  ];

  return (
    <>
      <h1 className='font-bold text-lg mb-4'>
        Twoli Contribution&apos;s Settings
      </h1>
      <div className='flex gap-3'>
        <div className='rounded-lg shadow-lg min-w-[220px] h-40'>
          <Menu
            model={menuItems}
            className='w-full'
            pt={{
              root: { className: 'bg-[#242E3B] border-none' },
              menu: { className: 'text-white' },
              menuitem: {
                className: 'hover:bg-gray-700 transition-colors duration-200',
              },
            }}
          />
        </div>

        <div className='flex-1 rounded-lg shadow-lg p-0'>
          {activeTab === 'Account' && (
            <div>
              <div className='p-4 bg-[#242E3B] rounded-lg shadow-lg'>
                <div className='flex flex-row justify-between'>
                  <h3 className='mt-0 text-gray-300'>Account</h3>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className=' profile-edit-btn w-12 h-8 mt-0 justify-center text-gray-400 hover:border hover:border-gray-400 p-2 rounded-x-lg hover:bg-gray-700 transition-all p-button-info p-button-outlined'
                  >
                    <i className='pi pi-pencil text-xl' />
                  </Button>
                </div>
                <div className='flex gap-8  pl-4 text-gray-400'>
                  <div className='flex flex-2 flex-col gap-4 flex-1'>
                    <div>
                      <label className='block mb-2 font-semibold'>Name</label>
                      <InputText
                        placeholder='Chama Name'
                        className='w-full p-inputtext-sm border border-gray-600 rounded-md transition-all duration-200 hover:border-blue-400 focus:border-blue-500'
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className='block mb-2 font-semibold'>About</label>
                      <InputTextarea
                        placeholder='Description of the Group'
                        className='w-full p-inputtextarea  border border-gray-600 rounded-md transition-all duration-200 hover:border-blue-400 focus:border-blue-500'
                        rows={3}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div
                    className={`flex flex-2 flex-col items-center justify-center text-center text-gray-400`}
                  >
                    <label
                      htmlFor='upload'
                      className={` ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-90'}`}
                    >
                      <div
                        className={`w-40 h-40  transition-all duration-200 rounded-full flex items-center justify-center overflow-hidden bg-gray-800 ${isEditing ? 'profileEditing' : ''}`}
                      >
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt='Uploaded'
                            className='object-cover w-full h-full'
                          />
                        ) : (
                          <span>Upload Image</span>
                        )}
                      </div>
                    </label>
                    <input
                      id='upload'
                      type='file'
                      accept='image/*'
                      className={`hidden`}
                      onChange={handleImageUpload}
                      disabled={!isEditing}
                    />
                    <span className='mt-2 text-sm'>Profile of the Chama</span>
                  </div>
                </div>

                {isEditing && (
                  <div className='flex gap-6 justify-end items-center mt-6'>
                    <Button
                      label='Cancel'
                      onClick={() => setIsEditing(false)}
                      severity='secondary'
                      className=' h-10'
                    />
                    <Button
                      type='button'
                      label='Update Chama'
                      icon='pi pi-check'
                      className=' p-button p-button-outlined p-button-info text-[#4084B9] '
                      style={{ width: '12rem', height: '2.5rem' }}
                      onClick={handleSaveAccountChanges}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Leadership' && (
            <div className=' leadership bg-[#242E3B] rounded-lg shadow-lg'>
              <h3 className='mt-0 p-3 text-gray-200'>Leadership</h3>
              <div className='text-center relative'>
                <h4 className='text-lg font-semibold mb-0 mx-2 text-gray-200 pb-2'>
                  Twoli Contribution Leadership
                </h4>
                <Button
                  onClick={() => setIsEditing(true)}
                  className=' profile-edit-btn mt-0 justify-center text-gray-300 hover:border hover:border-gray-300 p-2 rounded-x-lg hover:bg-gray-700 transition-all p-button-info p-button-outlined absolute right-4 top-2 h-5 w-8'
                >
                  <i className='pi pi-pencil text-xs' />
                </Button>
              </div>
              <div className='flex grid grid-cols-3 justify-between'>
                {renderRoleProfile('Chair')}
                {renderRoleProfile('Secretary')}
                {renderRoleProfile('Treasurer')}
              </div>
              {isEditing && (
                <div className='flex gap-6 justify-end items-center mt-6'>
                  <Button
                    label='Cancel'
                    onClick={() => setIsEditing(false)}
                    severity='secondary'
                    className=' h-10 mb-2'
                  />
                  <Button
                    type='button'
                    label='Update Leaders'
                    icon='pi pi-check'
                    className=' p-button p-button-outlined p-button-info text-[#4084B9] mr-2 mb-2'
                    style={{ height: '2.5rem' }}
                    onClick={handleSaveAccountChanges}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'Danger Zone' && (
            <div className='rounded '>
              <div className='text-center font-bold bg-[#242E3B] rounded-lg shadow-lg px-5 py-3'>
                <h3 className='font-bold text-xl mb-4 pb-2 border-b border-gray-600 mt-0'>
                  Reset your chama/group
                </h3>
                <div className='text-left text-gray-400'>
                  <p>
                    {' '}
                    Initiate a fresh start with the removal of all the existing.
                    Please be aware that the following data will be permanently
                    removed
                  </p>
                  <ul className='ml-10 m-3 list-disc'>
                    <li>All active or historical soft loans</li>
                    <li>All accounts, transactions and balances</li>
                    <li>All meetings held, minutes and attendance records</li>
                    <li>Notification log</li>
                  </ul>
                  <p>Only wallet balances will be retained</p>
                  <div className='text-right'>
                    <Button
                      icon='pi pi-refresh'
                      className='p-button p-button-warning p-button-outlined mt-4'
                      label="Reset Twoli Contribution's account"
                      style={{ height: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className='font-bold bg-[#242E3B] rounded-lg shadow-lg mt-6 px-5 py-3'>
                <div className='text-center'>
                  <h1 className='font-bold text-xl mb-4 pb-2 border-b border-gray-600 mt-0'>
                    Delete Chama/Group: Twoli contributions
                  </h1>
                </div>
                <div className='text-gray-400'>
                  <p>
                    Note: All members will receive notice if this group is
                    deleted. Kindly take note of the following information:
                  </p>
                  <ul className='ml-10 mt-3 list-decimal'>
                    <li>
                      Retention perion: You will have six months, until 19
                      september 2025, to access any group data that is necessary
                    </li>
                    <li className=''>
                      Information to be Removed Following Retention Term
                      <ul className='ml-10 m-3 list-disc'>
                        <li>All Active or Historical Soft loans</li>
                        <li>All accounts, transactions and balances</li>
                        <li>
                          All meetings held, minutes and attendance records
                        </li>
                        <li>Notification log</li>
                        <li>The balance of the group wallet</li>
                        <li>
                          All balances, accounts, and transactions related to
                          them
                        </li>
                      </ul>
                    </li>
                    <li>
                      Erreversible action: This data will not be retrieved after
                      the retention term
                    </li>
                  </ul>
                </div>
                <div className='text-right'>
                  <Button
                    icon='pi pi-trash'
                    className='p-button p-button-danger p-button-outlined mt-4'
                    label="Delete Twoli Contribution's account"
                    style={{ height: '2.5rem' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChamaSettings;

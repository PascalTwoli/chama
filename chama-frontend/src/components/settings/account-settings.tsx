import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import ProfileImageUpload from './profile-image-upload';

export default function AccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: 'Agustine',
    lastName: 'Twoli',
    otherNames: 'Nambia',
    email: 'agustinetwoli@gmail.com',
    phone: '0797039877',
    gender: 'Male',
    about: '',
  });

  const handleSaveProfileChanges = () => {
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='px-6 text-gray-100'>
      <h2 className='text-xl font-bold mb-4 mt-0'>Augustine Twoli’s profile</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Profile Panel */}

        <div className='bg-[#242E3B] rounded-xl p-6'>
          <h3 className='text-lg  text-gray-300 font-bold mt-0 mb-4'>
            Profile Details
          </h3>
          <div className='flex flex-col gap-8 items-center'>
            <div className='w-full flex justify-end items-center'>
              <Button
                onClick={() => setIsEditing(true)}
                className=' profile-edit-btn w-14 mt-0 justify-center text-gray-400 hover:border hover:border-gray-400 p-2 rounded-x-lg hover:bg-gray-700 transition-all p-button-info p-button-outlined'
              >
                <i className='pi pi-pencil text-xl' />
              </Button>
            </div>
            <ProfileImageUpload
              isParentEditing={isEditing}
              onStartEditing={() => setIsEditing(true)}
            />
            <p className='text-center font-bold text-white'>{`${form.firstName} ${form.lastName}`}</p>
          </div>
        </div>

        {/* Account Form */}
        <div className='md:col-span-2 bg-[#242E3B] font-bold text-gray-400 rounded-xl p-6'>
          <h3 className='text-lg font-semibold mb-6 mt-0'>Account</h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block mb-1 font-medium text-sm'>
                First Name:<span className='text-red-500'>*</span>
              </label>
              <InputText
                name='firstName'
                value={form.firstName}
                onChange={handleChange}
                className='w-full'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='block mb-1 font-medium text-sm'>
                Last Name:<span className='text-red-500'>*</span>
              </label>
              <InputText
                name='lastName'
                value={form.lastName}
                onChange={handleChange}
                className='w-full'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='block mb-1 font-medium text-sm'>
                Other Names:
              </label>
              <InputText
                name='otherNames'
                value={form.otherNames}
                onChange={handleChange}
                className='w-full'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='block mb-1 font-medium text-sm'>
                Gender:<span className='text-red-500'>*</span>
              </label>
              <InputText
                name='gender'
                value={form.gender}
                onChange={handleChange}
                className='w-full'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='block mb-1 font-medium text-sm'>
                E-mail Address:<span className='text-red-500'>*</span>
              </label>
              <InputText
                name='email'
                value={form.email}
                onChange={handleChange}
                className='w-full'
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className='block mb-1 font-medium text-sm'>
                Phone Number:<span className='text-red-500'>*</span>
              </label>
              <InputText
                name='phone'
                value={form.phone}
                onChange={handleChange}
                className='w-full'
                disabled={!isEditing}
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-1 font-medium text-sm'>
                About you
              </label>
              <InputTextarea
                name='about'
                value={form.about}
                onChange={handleChange}
                rows={4}
                className='w-full'
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            {isEditing && (
              <div className='flex gap-2 mt-4'>
                <Button
                  label='Cancel'
                  onClick={() => setIsEditing(false)}
                  severity='secondary'
                />
                <Button
                  onClick={handleSaveProfileChanges}
                  label='Save changes'
                  className='bg-[#4084B9] border-[#4084B9] px-6 py-2 font-normal'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

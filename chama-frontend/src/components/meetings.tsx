import { Button } from 'primereact/button';
import React, { FormEvent, useState } from 'react';

function Meetings() {
  const [details, setDetails] = useState({
    name: '',
    age: 0,
    email: '',
    phone: '',
  });
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(details);
  };

  return (
    <>
      <p>This is meetings page</p>
      <h3>Usestate Lessons</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input
          className='p-2'
          type='text'
          name='name'
          onChange={handleChange}
        />
        <label htmlFor='age'>Age</label>
        <input className='p-2' type='text' name='age' onChange={handleChange} />
        <label htmlFor='email'>Email</label>
        <input
          className='p-2'
          type='text'
          name='email'
          onChange={handleChange}
        />
        <label htmlFor='phone'>Phone</label>
        <input
          className='p-2'
          type='text'
          name='phone'
          onChange={handleChange}
        />
        <Button type='submit'>Submit</Button>
      </form>
      <h1>
        {/* {details.username} has clicked the button {details.counter} times. */}
      </h1>
    </>
  );
}

export default Meetings;

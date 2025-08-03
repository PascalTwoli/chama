import { useState, useEffect } from 'react';

function Softloans() {
  const [resourceType, setResourceType] = useState<any>('Posts');
  const [testButton, setTestButton] = useState<any>('Button1');
  const [windowWidth, setWindowWidth] = useState<any>(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('render');
  }, [resourceType]);

  return (
    <>
      <p>This is Soft loans page</p>
      <h2>UseEffect classes</h2>
      <button className='border' onClick={() => setResourceType('Posts')}>
        {' '}
        Posts
      </button>
      <button className='border' onClick={() => setResourceType('Users')}>
        {' '}
        Users
      </button>
      <button className='border' onClick={() => setResourceType('Comments')}>
        {' '}
        Comment
      </button>

      <div>
        <h1>{resourceType}</h1>
        <button
          onClick={() =>
            testButton == 'Button1'
              ? setTestButton('Button2')
              : setTestButton('Button1')
          }
        >
          {testButton}
        </button>
        <p>
          My current width: <h2>{windowWidth}</h2>{' '}
        </p>
      </div>
    </>
  );
}

export default Softloans;

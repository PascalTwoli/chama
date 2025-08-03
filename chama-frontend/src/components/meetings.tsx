import { Button } from 'primereact/button';
import { useState } from 'react';

interface UserName {
  name: string;
}

function Meetings() {
  const [name, setName] = useState<any>('Guest');
  const [age, setAge] = useState<any>(0);
  const [isEmployed, setIsEmployed] = useState<boolean>(false);
  const [count, setCount] = useState<any>(0);

  const changeName = () => {
    setName('Pascal Twoli');
  };

  const incrementAge = () => {
    setAge(age + 1);
  };

  const toggleEmploymentStatus = () => {
    setIsEmployed(!isEmployed);
  };

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count >= 1) {
      setCount(count - 1);
    }
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <>
      <p>This is meetings page</p>
      <div>
        <p> Name: {name}</p>
        <Button className='' onClick={changeName}>
          change name
        </Button>
      </div>

      <div>
        <p>Age: {age}</p>
        <Button onClick={incrementAge}>Increment Age</Button>
      </div>

      <div>
        <p>Is Employed? {isEmployed ? 'Yes' : 'No'}</p>
        <Button onClick={toggleEmploymentStatus}>Toggle Status</Button>
      </div>

      <div>
        <h2>Counter component</h2>
        <div>
          <Button onClick={increment}>Increment</Button>
          <Button onClick={decrement}>Decrement</Button>
          <Button onClick={reset}>Reset</Button>
          <p>My Count: {count}</p>
        </div>
      </div>
    </>
  );
}

export default Meetings;

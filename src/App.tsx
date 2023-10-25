import { useState } from 'react';
import './App.css';
import { Nurse } from './Nurse';
import { faker } from '@faker-js/faker';
import { UnitForm } from './Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [nurses] = useState(() => {
    return new Array(5).map(() => {
      return {
        fullName: faker.person.fullName()
      }
    })
  });
  console.log(nurses);

  return (
      <>
        {nurses.map((nurse) => (
          <Nurse fullName={nurse.fullName} />
        ))
        }
        <UnitForm></UnitForm>
      </>
    )
}

export default App

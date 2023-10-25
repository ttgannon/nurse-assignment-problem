import {useState} from 'react'
import './App.css'
import {faker} from "@faker-js/faker";
import { UnitForm } from './Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nurse } from './Nurse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';



interface Nurse {
  fullName: string
  yearsOfExperience: number
  unitName: string
}

const App = () => {
  //code for getting the units 
  //i STARTED BY MANAGING THE STATE WITHIN THE FORM FILE AND STILL DO FOR SOME
  //COMPONENTS; HOW TO KNOW WHEN TO MANAGE IN APP.TSX OR IN FORM.TSX?
  const [selected_unit, setSelectedUnit] = useState(null);
  
  //code for getting nurses from the units
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [next, setNext] = useState<boolean>(false);

  //What to do when unit is selected to get nurses
  function handleSubmit() {
    setNurses(() => {
        return Array.from({length: 5}, () => {
            const nurse: Nurse = {
                fullName: faker.person.fullName(),
                yearsOfExperience: faker.number.int({
                    min: 0,
                    max: 30
                }),
                unitName: faker.location.buildingNumber()
            }
            return nurse
        })
    })
    setNext(true);
  }

    //render the components
    return (
        <>
        <UnitForm selected_unit={selected_unit} setSelectedUnit={setSelectedUnit} />
        <button onClick={handleSubmit}>Next</button>
            { next ? (
            <div>
            <Container>   
              <Alert variant='primary'>These are the nurses we have on {selected_unit} for 
              the shift. Press the Red 'X' to 
              remove a nurse who isn't coming in, and the green 'Add another nurse' to add a new one.
              </Alert>
              <Row>
                <Col>
                {nurses.map(nurse => (
                      <Nurse nurse={nurse}/>
                  ))}
                </Col>
              </Row>
            </Container>
            <Button variant="success" >
              Add another nurse
            </Button>

            <button>
              Generate Assignment
            </button>
          </div>
        ) : null }
        
        </>
    )
};

export default App

import {useState} from 'react'
import './App.css'
import {faker} from "@faker-js/faker";
import { UnitForm } from './Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { PatientList } from './Patients';
import { Assignment } from './Assignment';
import { NurseCard } from './NurseCard';
import { Patient, Nurse } from './interfaces';


const App = () => {
  //code for getting the units 
  //i STARTED BY MANAGING THE STATE WITHIN THE FORM FILE AND STILL DO FOR SOME
  //COMPONENTS; HOW TO KNOW WHEN TO MANAGE IN APP.TSX OR IN FORM.TSX?
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assignment, setAssignments] = useState<boolean>(false)
  
  //code for getting nurses from the units
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [next, setNext] = useState<boolean>(false);

  //What to do when unit is selected to get nurses
  function handleSubmit() {
    setNurses(() => {
        return Array.from({length: 5}, (index:number) => {
            const nurse: Nurse = {
                id: index,
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
    setPatients(() => {
      return Array.from({length: 10}, () => {
        const patient: Patient = {
          fullName: faker.person.fullName(),
          unitName: faker.location.buildingNumber()
        }
        return patient
      })
    })
    setNext(true);
  }

  function generateAssignment() {
    setNext(false);
    setAssignments(true);
  }

    //render the components
    return (
        <>
        <UnitForm selectedUnit={selectedUnit} 
        setSelectedUnit={setSelectedUnit} 
        handleSubmit={handleSubmit} />
            { next ? (
            <div>
            <Container>   
              <Alert variant='primary'>These are the nurses we have on {selectedUnit} for 
              the shift. Press the Red 'X' to 
              remove a nurse who isn't coming in, and the green 'Add another nurse' to add a new one.
              </Alert>
              <Row>
                {nurses.map(nurse => (
                  <Col md={4}>
                      <NurseCard nurse={nurse} removeNurse={(id) => {
                      setNurses(nurses.filter((nurse) => nurse.id === id));
                    } }/>
                  </Col>
                  ))}
                
              </Row>
            </Container>
            <Button variant="success" >
              Add another nurse
            </Button>

            <button onClick={generateAssignment}>
              Generate Assignment
            </button>
            {next ? (<PatientList patients={patients}></PatientList>)
            : null}
          </div>
        ) : null }

            {assignment ? (
                <Assignment nurses={nurses} patients={patients}></Assignment>
              ): null} 
        </>
    )
};

export default App

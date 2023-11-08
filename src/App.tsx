import { useState } from "react";
import "./App.css";
import { faker } from "@faker-js/faker";
import { UnitForm } from "./components/UnitForm";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { PatientList, Assignment, NurseCard, NewNurseForm } from "./components";
import { Patient, Nurse } from "./interfaces";
import { URL_FOR_ACCESS } from "./api";

const App = () => {
  //code for getting the units
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assignment, setAssignments] = useState<boolean>(false);
  const accessToken = null;

  //code for getting nurses from the units
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [next, setNext] = useState<boolean>(false);

  //modal
  const [showModal, setShowModal] = useState(false);

  //What to do when unit is selected to get nurses
  async function handleSubmit() {
    setNurses(() => {
      return Array.from({ length: 5 }, (element, index: number) => {
        const nurse: Nurse = {
          id: index,
          fullName: faker.person.fullName(),
          yearsOfExperience: faker.number.int({
            min: 0,
            max: 30,
          }),
          unitName: faker.location.buildingNumber(),
        };
        return nurse;
      });
    });
    await fetchEpicData().then((data) => {
      setPatients(data);
    });
    setNext(true);
  }

  function generateAssignment() {
    setNext(false);
    setAssignments(true);
  }

  function addNewNurse(nurse: { nurseName: string; nurseUnit: string }) {
    setNurses(() => {
      return [
        ...nurses,
        {
          id: nurses.length,
          fullName: nurse.nurseName,
          yearsOfExperience: 0,
          unitName: nurse.nurseUnit,
        },
      ];
    });
    console.log(nurses);
    setShowModal(false);
  }

  //render the components
  return (
    <>
      <a href={URL_FOR_ACCESS}>Click to Sign in</a>
      {accessToken ? (
        <UnitForm
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
          handleSubmit={handleSubmit}
        />
      ) : null}

      {next ? (
        <div>
          <Container>
            <Alert variant="primary">
              These are the nurses we have on {selectedUnit} for the shift.
              Press the Red 'X' to remove a nurse who isn't coming in, and the
              green 'Add another nurse' to add a new one.
            </Alert>
            <Row>
              {nurses.map((nurse) => (
                <Col md={4}>
                  <NurseCard
                    nurse={nurse}
                    removeNurse={(id) => {
                      setNurses(nurses.filter((nurse) => nurse.id !== id));
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Container>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add another nurse
          </Button>

          <Button onClick={generateAssignment}>Generate Assignment</Button>
          {next ? (
            <div>
              <h1>Here are the unit patients</h1>
              <Row>
                {patients.map((patient) => (
                  <PatientList patient={patient} />
                ))}
              </Row>
            </div>
          ) : null}
        </div>
      ) : null}

      {assignment ? (
        <Assignment nurses={nurses} patients={patients}></Assignment>
      ) : null}

      <NewNurseForm
        showModal={showModal}
        setShowModal={setShowModal}
        addNewNurse={addNewNurse}
      />
    </>
  );
};

export default App;

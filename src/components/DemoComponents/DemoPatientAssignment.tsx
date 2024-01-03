// import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
// import { Nurse, Unit } from "../../interfaces";
import { useEffect, useRef, useState } from "react";
import { getNurses, getPatients, getUnits } from "../../hooks";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Nurse, Patient, Unit } from "../../interfaces";
import { GetInTouchModal } from "./GetInTouchModal";
import { DemoUnitSelection } from "./DemoUnitSelection";
import { DemoPatientTable } from "./DemoPatientTable";
import { DemoNurseTable } from "./DemoNurseTable";
import { getUnitPatients } from "../../services/apiCalls";
import { Assignment } from "../Assignment";

export const DemoPatientAssignment = () => {
  // const { units, nurses, patients } = await getDummyData();

  const [units, setUnits] = useState<Unit[] | null>(null);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [demoSelectedUnit, setDemoSelectedUnit] = useState<Unit | null>(null);
  const [nurses, setNurses] = useState<Nurse[] | []>([]);
  const [patients, setPatients] = useState<Patient[] | []>([]);
  const demoRef = useRef(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // useEffect(() => {
  //   if (!selectedUnit) return;
  //   const unit: Unit = {
  //     ...selectedUnit,
  //     nurses: nurses.filter((nurse) => nurse.unitId === selectedUnit?.id),
  //     patients: patients.filter(
  //       (patient) => patient.unitId === selectedUnit?.id,
  //     ),
  //   };
  //   setSelectedUnit(unit);
  // }, [nurses, patients, selectedUnit]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const result = await getUnits(); // Call your data fetching function
        setUnits(result);
      } catch (error) {
        setError(error);
      }
    };
    fetchUnits();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!units) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div ref={demoRef}>
        <Container className="p-3">
          <Container className="p-5 mb-4 bg-light rounded-3">
            <h1>Select your unit</h1>
            <Card>
              <Card.Header>Unit Selection</Card.Header>
              <Card.Body>
                <DemoUnitSelection
                  units={units}
                  onChange={async (unit_id) => {
                    const selectedUnit = units.find(
                      (unit) => unit.id === unit_id,
                    );
                    if (!selectedUnit) return;

                    setDemoSelectedUnit(selectedUnit);
                    const nurses = await getNurses(selectedUnit.id);
                    const patients = await getPatients(selectedUnit.id);
                    setNurses(nurses);
                    setPatients(patients);
                  }}
                />
              </Card.Body>
            </Card>
          </Container>
        </Container>

        {demoSelectedUnit && (
          <>
            <Container className="p-3">
              <Container className="p-5 mb-4 bg-light rounded-3">
                <h1>Incoming nurses</h1>
                <Card className="mt-4">
                  <Card.Header>Nurses</Card.Header>
                  <Card.Body>
                    <Alert variant="primary" dismissible>
                      These are the nurses we have on{" "}
                      {demoSelectedUnit?.unit_name} for the shift. Remove nurses
                      who aren't coming in, and add new ones who aren't already
                      scheduled.
                    </Alert>
                    <DemoNurseTable
                      nurses={nurses}
                      units={units}
                      removeNurse={(id) => {
                        setNurses(() =>
                          nurses.filter((nurse) => nurse.id !== id),
                        );
                      }}
                      addNurse={(nurse: Nurse) => {
                        setNurses([...nurses, nurse]);
                      }}
                    />
                  </Card.Body>
                </Card>
              </Container>
            </Container>
            <Container className="p-3">
              <Container className="p-5 mb-4 bg-light rounded-3">
                <h1>Patients on the floor</h1>
                <Card className="mt-4">
                  <Card.Header>Patients</Card.Header>
                  <Card.Body>
                    <DemoPatientTable
                      patients={patients}
                      units={selectedUnit}
                    />
                  </Card.Body>
                </Card>
              </Container>
            </Container>
            <Container className="p-3">
              <Container className="p-5 mb-4 bg-light rounded-3">
                <h1>Assignment</h1>
                <Assignment nurses={nurses} patients={patients} />
              </Container>
            </Container>
            <Container className="p-3">
              <Container className="p-5 mb-4 bg-light rounded-3">
                <div className="d-flex justify-content-center bg-light p-5">
                  <Row>
                    <Col md={8} className="justify-content-center text-left">
                      <h1>And just like that, your nurses can breathe easy.</h1>
                      <Button variant="info" onClick={() => setShowModal(true)}>
                        Get in touch
                      </Button>
                    </Col>

                    <Col>
                      <div>
                        <img
                          src="src/assets/lungs-fill.svg"
                          alt="Lungs Icon"
                          style={{ width: 100 }}
                          className="mt-3"
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Container>
            </Container>
            <GetInTouchModal
              showModal={showModal}
              hideModal={() => setShowModal(false)}
            />
          </>
        )}
      </div>
    </>
  );
};

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import {
  Assignment,
  NurseTable,
  PatientTable,
  UnitSelection,
  Auth,
} from "./components";
import { Nurse, Unit } from "./interfaces";
import { Card, Col, Row } from "react-bootstrap";
import { useDummyData } from "./hooks";
import "./assets/styles/homepage.css";

const App = () => {
  const { units, nurses: nurseData, patients } = useDummyData();

  const [accessToken, setAccessToken] = useState<string>("");

  const [nurses, setNurses] = useState<Nurse[]>(nurseData);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  // const [epicToken, setEpicToken] = useState("");

  useEffect(() => {
    if (!selectedUnit) return;
    const unit: Unit = {
      ...selectedUnit,
      nurses: nurses.filter((nurse) => nurse.unitId === selectedUnit?.id),
      patients: patients.filter(
        (patient) => patient.unitId === selectedUnit?.id,
      ),
    };
    setSelectedUnit(unit);
  }, [nurses, patients, selectedUnit]);

  function handleAccessToken(token: string) {
    localStorage.setItem("epic-access-token", token);
    setAccessToken(token);
  }

  return (
    <>
      {accessToken ? (
        <Container className="p-3">
          <Container className="p-5 mb-4 bg-light rounded-3">
            <Card>
              <Card.Header>Unit Selection</Card.Header>
              <Card.Body>
                <UnitSelection
                  units={units}
                  onChange={(id) => {
                    const unitId = units.find(
                      (unit) => unit.id.toString() === id,
                    );

                    if (!unitId) return;

                    const selectedUnit: Unit = {
                      ...unitId,
                      nurses: nurses.filter(
                        (nurse) => nurse.unitId === unitId?.id,
                      ),
                      patients: patients.filter(
                        (patient) => patient.unitId === unitId?.id,
                      ),
                    };
                    setSelectedUnit(selectedUnit);
                  }}
                />
              </Card.Body>
            </Card>
          </Container>
        </Container>
      ) : (
        <Container className="homePage">
          <Row>
            <Col>
              <h1 className="nursifyLogo">Nursify</h1>
            </Col>
            <Row>
              <img
                src="src/assets/nurses.jpg"
                style={{ maxWidth: 900 + "px", margin: 0 }}
              ></img>
              <Col className="align-items-center justify-content-center">
                <h1>Welcome to Nursify</h1>
                <h3 style={{ color: "grey" }}>
                  Making safer, fairer assignments.
                </h3>
                <Auth setAccessToken={handleAccessToken} />
              </Col>
            </Row>
          </Row>
        </Container>
      )}

      {selectedUnit && (
        <>
          <Card className="mt-4">
            <Card.Header>Nurses</Card.Header>
            <Card.Body>
              <Alert variant="primary" dismissible>
                These are the nurses we have on {selectedUnit?.name} for the
                shift. Remove nurses who aren't coming in, and add new ones who
                aren't already scheduled.
              </Alert>
              <NurseTable
                nurses={selectedUnit.nurses}
                units={units}
                removeNurse={(employeeId) => {
                  setNurses((nurses) =>
                    nurses.filter((nurse) => nurse.employeeId !== employeeId),
                  );
                }}
                addNurse={(nurse: Nurse) => {
                  setNurses(() => [...nurses, nurse]);
                }}
              />
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header>Patients</Card.Header>
            <Card.Body>
              <PatientTable patients={selectedUnit.patients} units={units} />
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header>Assignment</Card.Header>
            <Card.Body>
              <Assignment
                nurses={selectedUnit.nurses}
                patients={selectedUnit.patients}
              />
            </Card.Body>
          </Card>
        </>
      )}
      <Container className="loginContainer">
        <Row>
          <Col>
            <h5>Pricing</h5>
          </Col>
          <Col>
            <h5>Terms</h5>
          </Col>
          <Col>
            <h5>Contact</h5>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;

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
import { Button, Card, Col, Form, Row } from "react-bootstrap";
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
        <Container fluid className="homePage">
          <Row>
            <Col md={5} style={{ backgroundColor: "rgb(145, 44, 240)" }}>
              <h1 className="nursifyLogo">Nursify</h1>
              <img
                src="src/assets/nurses.jpg"
                style={{
                  maxWidth: 550 + "px",
                  marginBottom: 100 + "px",
                }}
              ></img>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: 90 + "px",
                  marginTop: 30 + "%",
                  marginBottom: 50 + "%",
                  maxWidth: "fit-content",
                }}
              >
                Nurses deserve safe patient assignments.
              </h1>
            </Col>
            <Col className="align-items-center justify-content-center">
              <div style={{ marginTop: 25 + "%" }}>
                <h1 style={{ fontSize: 70 + "px", textAlign: "center" }}>
                  Welcome to Nursify.
                </h1>
                <Alert variant="info" style={{ textAlign: "center" }}>
                  <Alert.Heading style={{ fontSize: 20 + "px" }}>
                    Making safer, fairer patient assignments with the power of
                    machine learning.
                  </Alert.Heading>
                  <p className="mb-0"></p>
                </Alert>
                <Row className="justify-content-center align-items-center d-flex">
                  <Col className="d-flex justify-content-center align-items-center">
                    <Auth setAccessToken={handleAccessToken} />
                    <Form>
                      <Button type="submit" variant="outline-secondary">
                        Try a demo
                      </Button>
                    </Form>
                  </Col>
                </Row>

                <Card
                  style={{
                    width: 700 + "px",
                    margin: 15 + "px",
                    marginTop: 70 + "%",
                    fontSize: 20 + "px",
                  }}
                  className="mb-2"
                  text="black"
                  key="success"
                  bg="light"
                >
                  <Card.Header>
                    <strong>How does it work?</strong>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      We've trained our digital Charge Nurse on millions of
                      nurse-patient assignments. Cally looks at your floor's
                      patients and makes a safe, fair nurse-patient assignment
                      at the click of a button, saving you time and making your
                      nurses happier.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
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

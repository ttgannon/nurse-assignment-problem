import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import {
  Assignment,
  NurseTable,
  PatientTable,
  UnitSelection,
  Auth,
} from "./components";
import { Nurse, Patient, Unit } from "./interfaces";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDummyData } from "./hooks";
import "./assets/styles/homepage.css";
import { DemoPatientAssignment } from "./components/DemoPatientAssignment";
import { getUnits } from "./services/apiCalls";

const App = () => {
  const { units, nurses: nurseData, patients } = useDummyData();

  const [accessToken, setAccessToken] = useState<string>("");
  const ref = useRef(null);

  const [nurses, setNurses] = useState<Nurse[]>(nurseData);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [patientList, setPatientList] = useState<object | null>(null);

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

  // useEffect(() => {
  //   const getData = async () => {
  //     const list = await getUnits(accessToken);
  //     if (list) {
  //       setPatientList(list);
  //     }
  //   };
  //   if (accessToken !== "") {
  //     getData();
  //   }
  // }, [accessToken]);

  return (
    <>
      {accessToken && patientList ? (
        <Container className="p-3">
          <Container className="p-5 mb-4 bg-light rounded-3">
            <h1>Select your unit tonight</h1>
            <Card>
              <Card.Header>Unit Selection</Card.Header>
              <Card.Body>
                <UnitSelection
                  units={patientList}
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
            <Col
              md={5}
              style={{
                backgroundColor: "rgb(145, 44, 240)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h1 className="nursifyLogo">Nursify</h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="src/assets/doctor-surgeon-icon.svg"
                  style={{
                    maxWidth: "400px",

                    marginTop: "50px",
                  }}
                  alt="Doctor Surgeon Icon"
                />
              </div>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: 90 + "px",
                  marginTop: 50 + "%",
                  marginBottom: 50 + "%",
                  maxWidth: "fit-content",
                  color: "black",
                }}
              >
                Nurses deserve safe patient assignments.
              </h1>
            </Col>
            <Col className="align-items-center justify-content-center">
              <div
                className="align-items-center text-align-center"
                style={{
                  marginTop: 25 + "%",
                  flexDirection: "column",
                  display: "flex",
                }}
              >
                <h1 style={{ fontSize: 70 + "px", textAlign: "center" }}>
                  Welcome to Nursify.
                </h1>
                <Alert
                  className="d-flex"
                  variant="info"
                  style={{
                    textAlign: "center",
                    maxWidth: 40 + "vw",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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
                      <Button
                        onClick={() => {
                          if (ref.current)
                            (ref.current as HTMLDivElement).scrollIntoView();
                        }}
                        variant="outline-secondary"
                      >
                        Try a demo
                      </Button>
                    </Form>
                  </Col>
                </Row>
                <div
                  style={{
                    marginTop: 125 + "px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="src/assets/hospital-building-color-icon.svg"
                    alt="Hospital Icon"
                    width="150px"
                  />
                </div>
                <Card
                  style={{
                    width: 700 + "px",

                    marginTop: 20 + "%",
                    marginBottom: 30 + "%",
                    fontSize: 20 + "px",
                  }}
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
              <h1 style={{ marginBottom: 1 + "%", marginTop: 40 + "px" }}>
                Go ahead. Check it out.
              </h1>
              <div ref={ref} style={{ marginBottom: 10 + "%" }}>
                <DemoPatientAssignment
                  patients={patients}
                  units={units}
                  nurses={nurses}
                />
              </div>
            </Col>
          </Row>
        </Container>
      )}

      {selectedUnit && (
        <>
          <Container className="p-3">
            <Container className="p-5 mb-4 bg-light rounded-3">
              <h1>Incoming nurses</h1>
              <Card className="mt-4">
                <Card.Header>Nurses</Card.Header>
                <Card.Body>
                  <Alert variant="primary" dismissible>
                    These are the nurses we have on {selectedUnit?.name} for the
                    shift. Remove nurses who aren't coming in, and add new ones
                    who aren't already scheduled.
                  </Alert>
                  <NurseTable
                    nurses={selectedUnit.nurses}
                    units={units}
                    removeNurse={(employeeId) => {
                      setNurses((nurses) =>
                        nurses.filter(
                          (nurse) => nurse.employeeId !== employeeId,
                        ),
                      );
                    }}
                    addNurse={(nurse: Nurse) => {
                      setNurses(() => [...nurses, nurse]);
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
                  <PatientTable
                    patients={selectedUnit.patients}
                    units={units}
                  />
                </Card.Body>
              </Card>
            </Container>
          </Container>
          <Container className="p-3">
            <Container className="p-5 mb-4 bg-light rounded-3">
              <h1>Assignments</h1>
              <Card className="mt-4">
                <Card.Header>Assignment</Card.Header>
                <Card.Body>
                  <Assignment
                    nurses={selectedUnit.nurses}
                    patients={selectedUnit.patients}
                  />
                </Card.Body>
              </Card>
            </Container>
          </Container>
        </>
      )}
      <Container fluid className="loginContainer">
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

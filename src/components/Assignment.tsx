import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Nurse } from "./Nurse";
import { Nurse as NurseType, Patient } from "../interfaces";
import "../Nurse.css";

export const Assignment = ({
  nurses,
  patients,
}: {
  nurses: NurseType[];
  patients: Patient[];
}) => {
  const patientsPerNurse = patients.length / nurses.length;
  const nursesAndPatients = [];
  let patientIdx = 0;
  for (const nurse of nurses) {
    const assignedPatients = patients.slice(
      patientIdx,
      patientIdx + patientsPerNurse,
    );
    nursesAndPatients.push({ nurse, patients: assignedPatients });
    patientIdx += patientsPerNurse;
  }

  return (
    <Container>
      <Row>
        {nursesAndPatients.map((nurse) => (
          <Col xs={4}>
            <Card body className="nurse-info">
              <Row>
                <h3>Nurse:</h3>
                <Col xs={10}>
                  <Nurse nurse={nurse.nurse} />
                </Col>
                <Col>
                  <Button variant="danger">Remove</Button>
                </Col>
              </Row>
              <Row>
                <h3>Patients:</h3>
                {nurse.patients.map((patient) => (
                  <div>
                    <h6>{patient.fullName}</h6>
                  </div>
                ))}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

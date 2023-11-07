import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Nurse } from "./Nurse";
import { Nurse as NurseType, Patient } from "../interfaces";
import "../Nurse.css";
import { generateAssignments } from "../services";

export const Assignment = ({
  nurses,
  patients,
}: {
  nurses: NurseType[];
  patients: Patient[];
}) => {
  const assignments = generateAssignments(patients, nurses);

  return (
    <Container>
      <Row>
        {assignments.map(({ nurse, patients }) => (
          <Col xs={4}>
            <Card body className="nurse-info">
              <Row>
                <h3>Nurse:</h3>
                <Col xs={10}>
                  <Nurse nurse={nurse} />
                </Col>
                <Col>
                  <Button variant="danger">Remove</Button>
                </Col>
              </Row>
              <Row>
                <h3>Patients:</h3>
                {patients.map(({ fullName }) => (
                  <div>
                    <h6>{fullName}</h6>
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

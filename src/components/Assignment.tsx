import { Card, Col, Row } from "react-bootstrap";
import { Nurse, Patient } from "../interfaces";
import { generateAssignments } from "../services";

export const Assignment = ({
  nurses,
  patients,
}: {
  nurses: Nurse[];
  patients: Patient[];
}) => {
  const assignments = generateAssignments(patients, nurses);

  return (
    <Row>
      {assignments.map(({ nurse, patients }) => (
        <Col key={nurse.employeeId} md={6} lg={4} className="mb-3">
          <Card>
            <Card.Header>
              <strong>Nurse: </strong>
              {nurse.fullName}
            </Card.Header>
            <Card.Body>
              {patients.length ? (
                <>
                  <Card.Title>Patients</Card.Title>
                  <ul>
                    {patients.map(({ id, fullName }) => (
                      <li key={id}>{fullName}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <span className="text-muted">No patients assigned</span>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

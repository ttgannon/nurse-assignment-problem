import { Card, Col, Row } from "react-bootstrap";
import { Nurse, Patient } from "../interfaces";
import { EpicPatient } from "../interfaces/LoggedInInterface/EpicPatient";
import { generateAssignments } from "../services";

export const Assignment = ({
  nurses,
  patients,
}: {
  nurses: Nurse[];
  patients: EpicPatient[] | Patient[];
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
                    {patients.every((patient) => patient.item)
                      ? patients.map(({ item }, index) => (
                          <li key={index}>{item.display}</li>
                        ))
                      : patients.map(({ fullName }, index) => (
                          <li key={index}>{fullName}</li>
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

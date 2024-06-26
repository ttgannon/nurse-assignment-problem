import { Card, Col, Row } from "react-bootstrap";
import { Nurse, Patient } from "../interfaces";
import { EpicPatient } from "../interfaces/LoggedInInterface/EpicPatient";
import { generateAssignments } from "../services";
import { right } from "@popperjs/core";

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
      {assignments.map(({ nurse, patients, assignmentAcuityScore }) => (
        <Col key={nurse.id} md={6} lg={4} className="mb-3">
          <Card>
            <Card.Header>
              <Row>
                <Col>
                  <strong>Nurse: </strong>
                  {nurse.nurse_name ? nurse.nurse_name : nurse.fullName}
                </Col>
                <Col style={{ textAlign: right }}>
                  <p>Assignment Score: {assignmentAcuityScore}</p>
                </Col>
              </Row>
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
                      : patients.map(({ last_name, first_name }, index) => (
                          <li key={index}>{first_name + " " + last_name}</li>
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

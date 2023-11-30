import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { Assignment, NurseTable, UnitSelection } from ".";

export const LoggedInAssignment = () => {
  function setNurses(arg0: () => any[]) {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {accessToken && (
        <Container className="p-3">
          <Container className="p-5 mb-4 bg-light rounded-3">
            <h1>Select your unit tonight</h1>
            <Card>
              <Card.Header>Unit Selection</Card.Header>
              <Card.Body>
                {!patientList ? (
                  <Spinner animation="border" />
                ) : (
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
                )}
              </Card.Body>
            </Card>
          </Container>
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
    </>
  );
};

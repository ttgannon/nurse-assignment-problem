import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { Assignment, NurseTable, UnitSelection } from ".";
import { useEffect, useState } from "react";
import { getUnitPatients, getUnits } from "../services/apiCalls";

export const LoggedInAssignment = () => {
  const accessToken = localStorage.getItem("epic-access-token") as string;
  const [unitList, setUnitList] = useState<object | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [patients, setPatients] = useState<object | null>(null);

  useEffect(() => {
    const getUnitList = async () => {
      const list = await getUnits(accessToken);
      if (list) {
        setUnitList(list);
      }
    };
    if (accessToken !== "") {
      getUnitList();
    }
  }, [accessToken]);

  return (
    <>
      {accessToken && (
        <Container className="p-3">
          <Container className="p-5 mb-4 bg-light rounded-3">
            <h1>Select your unit tonight</h1>
            <Card>
              <Card.Header>Unit Selection</Card.Header>
              <Card.Body>
                {!unitList ? (
                  <Spinner animation="border" />
                ) : (
                  <UnitSelection
                    units={unitList}
                    onChange={async (event) => {
                      const patients = await getUnitPatients(
                        accessToken,
                        event.currentTarget.value,
                      );
                      const idx = event.target.selectedIndex;
                      const selectedText = event.target.options[idx].text;
                      setPatients(patients);
                      setSelectedUnit(selectedText);
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
                    These are the nurses we have on {selectedUnit} for the
                    shift. Remove nurses who aren't coming in, and add new ones
                    who aren't already scheduled.
                  </Alert>
                  {/* <NurseTable
                    nurses={nurses}
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
                  /> */}
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
                  {/* <PatientTable patients={patients} units={units} /> */}
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
                  {/* <Assignment
                    nurses={selectedUnit.nurses}
                    patients={selectedUnit.patients}
                  /> */}
                </Card.Body>
              </Card>
            </Container>
          </Container>
        </>
      )}
    </>
  );
};

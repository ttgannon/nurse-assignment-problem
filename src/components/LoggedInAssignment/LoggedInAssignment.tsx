import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { Assignment, UnitSelection } from "..";
import { useEffect, useState } from "react";
import { getUnitPatients, getUnits } from "../../services/apiCalls";
import { LoggedInPatientTable } from "./LoggedInPatientTable";
import { EpicPatient, Nurse } from "../../interfaces";
import { EpicUnit } from "../../interfaces/LoggedInInterface/EpicUnit";
import { DemoNurseTable } from "../DemoComponents/DemoNurseTable";
import { useDummyData } from "../../hooks";

export const LoggedInAssignment = () => {
  const accessToken = localStorage.getItem("epic-access-token") as string;
  const [unitList, setUnitList] = useState<EpicUnit[] | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [patients, setPatients] = useState<EpicPatient[]>([]);

  const { nurses, units } = useDummyData();

  const [nursesDemo, setNursesDemo] = useState<Nurse[]>(nurses);

  useEffect(() => {
    const getUnitList = async () => {
      const list = await getUnits(accessToken);
      if (list) {
        setUnitList(list.entry);
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
                      setPatients(patients.entry);
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
                  <DemoNurseTable
                    nurses={nurses.filter((nurse) => {
                      return nurse.unitId === nurses[0].unitId;
                    })}
                    units={units}
                    removeNurse={(employeeId) => {
                      setNursesDemo((nurses: Nurse[]) =>
                        nurses.filter(
                          (nurse) => nurse.employeeId !== employeeId,
                        ),
                      );
                    }}
                    addNurse={(nurse: Nurse) => {
                      setNursesDemo(() => [...nurses, nurse]);
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
                  <LoggedInPatientTable patients={patients} />
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
                    nurses={nurses.filter((nurse) => {
                      return nurse.unitId === nurses[0].unitId;
                    })}
                    patients={patients}
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

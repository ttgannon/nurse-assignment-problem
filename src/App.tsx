import { useState } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import {
  Assignment,
  NurseTable,
  PatientTable,
  UnitSelection,
} from "./components";
import { Nurse, Unit } from "./interfaces";
import { Card } from "react-bootstrap";
import { useDummyData } from "./hooks";

const App = () => {
  const { units, nurses: nurseData, patients } = useDummyData();

  const [nurses, setNurses] = useState<Nurse[]>(nurseData);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  return (
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <h1>Nursify</h1>
        <Card>
          <Card.Header>Unit Selection</Card.Header>
          <Card.Body>
            <UnitSelection
              units={units}
              onChange={(id) => {
                const unitId = units.find((unit) => unit.id.toString() === id);

                if (!unitId) return;

                const selectedUnit: Unit = {
                  ...unitId,
                  nurses: nurses.filter((nurse) => nurse.unitId === unitId?.id),
                  patients: patients.filter(
                    (patient) => patient.unitId === unitId?.id,
                  ),
                };
                setSelectedUnit(selectedUnit);
              }}
            />
          </Card.Body>
        </Card>
        {selectedUnit && (
          <>
            <Card className="mt-4">
              <Card.Header>Nurses</Card.Header>
              <Card.Body>
                <Alert variant="primary" dismissible>
                  These are the nurses we have on {selectedUnit?.name} for the
                  shift. Remove nurses who aren't coming in, and add new ones
                  whoa aren't already scheduled.
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
      </Container>
    </Container>
  );
};

export default App;

import { Alert, Button, Card, Container } from "react-bootstrap";
import { Assignment, NurseTable, PatientTable } from ".";
import { Nurse, Patient, Unit } from "../interfaces";
import { useEffect, useRef, useState } from "react";
import { DemoUnitSelection } from "./DemoUnitSelection";
import { useDummyData } from "../hooks";

export const DemoPatientAssignment = () => {
  const { units, nurses, patients } = useDummyData();

  const [demoSelectedUnit, setDemoSelectedUnit] = useState<Unit | null>(null);
  const demoRef = useRef(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

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

  return (
    <>
      <div ref={demoRef}>
        <Container className="p-3">
          <Container className="p-5 mb-4 bg-light rounded-3">
            <h1>Select your unit</h1>
            <Card>
              <Card.Header>Unit Selection</Card.Header>
              <Card.Body>
                <DemoUnitSelection
                  units={units}
                  onChange={(id) => {
                    const unitId = units.find(
                      (unit) => unit.id.toString() === id,
                    );

                    if (!unitId) return;

                    const demoSelectedUnit: Unit = {
                      ...unitId,
                      nurses: nurses.filter(
                        (nurse) => nurse.unitId === unitId?.id,
                      ),
                      patients: patients.filter(
                        (patient) => patient.unitId === unitId?.id,
                      ),
                    };
                    setDemoSelectedUnit(demoSelectedUnit);
                  }}
                />
              </Card.Body>
            </Card>
          </Container>
        </Container>

        {demoSelectedUnit && (
          <>
            <Container className="p-3">
              <Container className="p-5 mb-4 bg-light rounded-3">
                <h1>Incoming nurses</h1>
                <Card className="mt-4">
                  <Card.Header>Nurses</Card.Header>
                  <Card.Body>
                    <Alert variant="primary" dismissible>
                      These are the nurses we have on {demoSelectedUnit?.name}{" "}
                      for the shift. Remove nurses who aren't coming in, and add
                      new ones who aren't already scheduled.
                    </Alert>
                    <NurseTable
                      nurses={demoSelectedUnit.nurses}
                      units={units}
                      removeNurse={(employeeId) => {
                        setDemoSelectedUnit(() => ({
                          ...demoSelectedUnit,
                          nurses: demoSelectedUnit.nurses.filter(
                            (nurse) => nurse.employeeId !== employeeId,
                          ),
                        }));
                      }}
                      addNurse={(nurse: Nurse) => {
                        setDemoSelectedUnit(() => ({
                          ...demoSelectedUnit,
                          nurses: [...demoSelectedUnit.nurses, nurse],
                        }));
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
                      patients={demoSelectedUnit.patients}
                      units={units}
                    />
                  </Card.Body>
                </Card>
              </Container>
            </Container>
            <Container className="p-3">
              <Container className="p-5 mb-4 bg-light rounded-3">
                <h1>Assignment</h1>
                <Assignment
                  nurses={demoSelectedUnit.nurses}
                  patients={demoSelectedUnit.patients}
                />
              </Container>
            </Container>
            <h1>And just like that, your nurses can breathe easy.</h1>
            <Button variant="info">Get in touch</Button>
          </>
        )}
      </div>
    </>
  );
};

import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import { useState } from "react";
import { Unit, Nurse } from "../../interfaces/index.ts";
import { DemoAddNurseModal } from "./DemoAddNurseModal.tsx";

export const DemoNurseTable = ({
  nurses,
  removeNurse,
  addNurse,
  units,
  demoSelectedUnit,
}: {
  nurses: Nurse[];
  units: Unit[];
  removeNurse: (id: number) => void;
  addNurse: (nurse: Nurse) => void;
  demoSelectedUnit: Unit;
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Years of Experience</th>
            <th>Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {nurses.map(({ id, nurse_name, years_exp, unitDetails }) => (
            <tr key={id + nurse_name}>
              <td>{nurse_name}</td>
              <td>{years_exp}</td>
              <td>
                {unitDetails?.unit_name || demoSelectedUnit?.unit_name || "N/A"}
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  onClick={() => removeNurse(id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-align-right">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add another nurse
        </Button>
      </div>
      <DemoAddNurseModal
        demoSelectedUnit={demoSelectedUnit}
        nurses={nurses}
        showModal={showModal}
        hideModal={() => setShowModal(false)}
        addNurse={addNurse}
        units={units}
      />
    </>
  );
};

import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import { useState } from "react";
import { Unit, Nurse } from "../../interfaces/index.ts";
import { LoggedInAddNurseModal } from "./LoggedInAddNurseModal.tsx";

export const LoggedInNurseTable = ({
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
  console.log(nurses);
  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Years of Experience</th>
          </tr>
        </thead>
        <tbody>
          {nurses.map(({ id, fullName }) => (
            <tr key={id + fullName}>
              <td>{fullName}</td>
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
      <LoggedInAddNurseModal
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

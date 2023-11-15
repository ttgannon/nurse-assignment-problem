import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Nurse, Unit } from "../interfaces";
import { AddNurseModal } from "./AddNurseModal.tsx";
import { useState } from "react";

export const NurseTable = ({
  nurses,
  removeNurse,
  addNurse,
  units,
}: {
  nurses: Nurse[];
  units: Unit[];
  removeNurse: (id: number) => void;
  addNurse: (nurse: Nurse) => void;
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Employee Id</th>
            <th>Name</th>
            <th>Years of Experience</th>
            <th>Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {nurses.map(({ employeeId, fullName, yearsOfExperience, unitId }) => (
            <tr key={employeeId}>
              <td>{employeeId}</td>
              <td>{fullName}</td>
              <td>{yearsOfExperience}</td>
              <td>{units.find((unit) => unit.id === unitId)?.name || "N/A"}</td>
              <td>
                <Button
                  variant="outline-danger"
                  onClick={() => removeNurse(employeeId)}
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
      <AddNurseModal
        showModal={showModal}
        hideModal={() => setShowModal(false)}
        addNurse={addNurse}
        units={units}
      />
    </>
  );
};

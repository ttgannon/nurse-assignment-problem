import { Button } from "./ui/button";
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
      <table className="table table-striped table-bordered">
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
          {nurses.map(({ id, nurse_name, years_exp, unitDetails }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{nurse_name}</td>
              <td>{years_exp}</td>
              <td>{unitDetails.unit_name}</td>
              <td>
                <Button
                  variant="destructive"
                  onClick={() => removeNurse(Number(id))}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-align-right">
        <Button variant="default" onClick={() => setShowModal(true)}>
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

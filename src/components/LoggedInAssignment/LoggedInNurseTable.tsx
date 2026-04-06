import { Button } from "../ui/button";

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
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Years of Experience</th>
          </tr>
        </thead>
        <tbody>
          {nurses.map(({ id, nurse_name }) => (
            <tr key={id + nurse_name}>
              <td>{nurse_name}</td>
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

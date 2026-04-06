import { Button } from "../ui/button";
import { EpicPatient } from "../../interfaces";

export const LoggedInPatientTable = ({
  patients,
}: {
  patients: EpicPatient[];
}) => {
  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Id</th>
          <th>Patient Name</th>
          <th>Is patient being discharged this shift?</th>
          <th>
            Remove this patient if you don't want them included in the
            assignment (e.g., they have been discharged)
          </th>
        </tr>
      </thead>
      <tbody>
        {patients.map((el, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{el.item.display}</td>
            <td>
              <input type="checkbox" />
            </td>
            <td>
              <Button variant="destructive">Remove</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

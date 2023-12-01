import { Button, Table } from "react-bootstrap";
import { EpicPatient } from "../../interfaces";

export const LoggedInPatientTable = ({
  patients,
}: {
  patients: EpicPatient[];
}) => {
  return (
    <Table striped bordered>
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
              <Button variant="outline-danger">Remove</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

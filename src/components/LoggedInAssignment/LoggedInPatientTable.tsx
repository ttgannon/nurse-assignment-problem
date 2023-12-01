import { Button, Table } from "react-bootstrap";

export const LoggedInPatientTable = ({ patients }: { patients: object }) => {
  console.log(patients);
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
        {patients.entry.map((el, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{el.item.display}</td>
            <td>
              <input type="checkbox" />
            </td>
            <td>
              <Button variant="outline-danger" onClick={console.log("remove")}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

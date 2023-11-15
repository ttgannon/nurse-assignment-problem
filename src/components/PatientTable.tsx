import { Patient, Unit } from "../interfaces";
import { Table } from "react-bootstrap";

export const PatientTable = ({
  patients,
  units,
}: {
  patients: Patient[];
  units: Unit[];
}) => {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Id</th>
          <th>Patient Name</th>
          <th>Unit</th>
        </tr>
      </thead>
      <tbody>
        {patients.map(({ id, fullName, unitId }) => (
          <tr key={id}>
            <td>{id}</td>
            <td>{fullName}</td>
            <td>{units.find((unit) => unit.id === unitId)?.name || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

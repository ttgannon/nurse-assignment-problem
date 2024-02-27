import { Patient, Unit } from "../../interfaces";
import { Table } from "react-bootstrap";

export const DemoPatientTable = ({
  patients,
}: {
  patients: Patient[];
  units: Unit;
}) => {
  return (
    <>
      <div style={{ height: "400px", overflowY: "auto" }}>
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(({ id, first_name, last_name, patient_id }) => (
              <tr key={id}>
                <td>{patient_id}</td>
                <td>{first_name}</td>
                <td>{last_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

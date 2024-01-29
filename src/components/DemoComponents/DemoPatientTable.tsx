import { Patient, Unit } from "../../interfaces";
import { Table } from "react-bootstrap";

export const DemoPatientTable = ({
  patients,
  units,
}: {
  patients: Patient[];
  units: Unit | null;
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
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(
              ({ id, first_name, last_name, patient_id, unitDetails }) => (
                <tr key={id}>
                  <td>{patient_id}</td>
                  <td>{first_name}</td>
                  <td>{last_name}</td>
                  {unitDetails?.unit_name || "N/A"}
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

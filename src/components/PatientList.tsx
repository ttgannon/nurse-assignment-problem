import { Patient } from "../interfaces";

export const PatientList = ({ patient }: { patient: Patient }) => {
  return (
    <>
      <h3>{patient.fullName}</h3>
    </>
  );
};

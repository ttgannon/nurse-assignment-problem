import { Assignment, EpicPatient, Nurse, Patient } from "../interfaces";

export const generateAssignments = (
  patients: EpicPatient[] | Patient[],
  nurses: Nurse[],
): Assignment[] => {
  const patientsCopy = [...patients];
  const patientsPerNurse = Math.floor(patientsCopy.length / nurses.length);
  const extraPatients = patientsCopy.length % nurses.length;

  return nurses.map((nurse, index) => {
    const additionalPatients = index < extraPatients ? 1 : 0;
    const assignedPatientsCount = patientsPerNurse + additionalPatients;

    const assignedPatients = patientsCopy.splice(0, assignedPatientsCount);

    const assignment: Assignment = {
      nurse,
      patients: assignedPatients,
    };

    return assignment;
  });
};

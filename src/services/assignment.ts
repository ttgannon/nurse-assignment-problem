import { Assignment, Nurse, Patient } from "../interfaces";

export const generateAssignments = (
  patients: Patient[],
  nurses: Nurse[],
): Assignment[] => {
  const patientsPerNurse = patients.length / nurses.length;

  return nurses.map((nurse, index) => {
    const assignment: Assignment = {
      nurse,
      patients: patients.slice(index, index + patientsPerNurse),
    };

    return assignment;
  });
};

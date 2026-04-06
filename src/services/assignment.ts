/*

This file has two functions: 
1) patientsWithAcuityScore which calculates acuity scores for each patient and returns an object with the patient's information INCLUDING their acuity score, and 
2) allocates patients to their assignment using a greedy algorithm.

*/
import { Assignment, EpicPatient, Nurse, Patient } from "../interfaces";

export const patientsWithAcuityScore = (
  patients: EpicPatient[] | Patient[],
) => {
  console.log(patients);
  for (const patient of patients) {
    patient.acuityScore = 0;

    if ("continent" in patient && patient.continent) {
      patient.acuityScore -= 5;
    }
    if ("independently_mobile" in patient && patient.independently_mobile) {
      patient.acuityScore -= 6;
    }
    if ("num_meds" in patient && patient.num_meds) {
      patient.acuityScore += patient.num_meds;
    }
    if ("high_risk_meds" in patient && patient.high_risk_meds) {
      patient.acuityScore += patient.high_risk_meds * 4;
    }
    if ("num_devices" in patient && patient.num_devices) {
      patient.acuityScore += patient.num_devices * 5;
    }
    if ("num_drips" in patient && patient.num_drips) {
      patient.acuityScore += patient.num_drips * 4;
    }
    if ("new_trach" in patient && patient.new_trach) {
      patient.acuityScore += 5;
    }
    if ("tube_feeds" in patient && patient.tube_feeds) {
      patient.acuityScore += 4;
    }
    if ("wound_care" in patient && patient.wound_care) {
      patient.acuityScore += 4;
    }
  }
  return patients;
};

export const generateAssignments = (
  patients: EpicPatient[] | Patient[],
  nurses: Nurse[],
): Assignment[] => {
  const patientsCopy = patientsWithAcuityScore(patients);
  // const patientsPerNurse = Math.floor(patientsCopy.length / nurses.length);
  // const extraPatients = patientsCopy.length % nurses.length;

  // Sort the numbers in descending order
  patientsCopy.sort((a, b) => b.acuityScore - a.acuityScore);

  // Initialize an array to store the sum of each bin
  const assignments = Array.from({ length: nurses.length }, () => ({
    nurse: null as Nurse | null,
    assignmentAcuityScore: 0,
    patients: [] as (Patient | EpicPatient)[],
  }));

  console.log(assignments, nurses.length);

  // Function to find the bin with the smallest sum
  function findMinBin() {
    let minBinIndex = 0;
    for (let i = 1; i < assignments.length; i++) {
      if (
        assignments[i].assignmentAcuityScore <
        assignments[minBinIndex].assignmentAcuityScore
      ) {
        minBinIndex = i;
      }
    }
    return minBinIndex;
  }
  console.log(patientsCopy);

  for (const patient of patientsCopy) {
    const minBinIndex = findMinBin();
    assignments[minBinIndex].assignmentAcuityScore += patient.acuityScore;
    //Every patient in an assignment is worth 8 points to ensure nurses do not end up with far more patients with lower scores than their colleagues
    assignments[minBinIndex].assignmentAcuityScore += 8;
    assignments[minBinIndex].patients.push(patient);
  }

  return nurses.map((nurse, index) => {
    const assignment: Assignment = {
      nurse,
      patients: assignments[index].patients,
      assignmentAcuityScore: assignments[index].assignmentAcuityScore,
    };
    return assignment;
  });
};

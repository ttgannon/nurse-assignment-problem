import { Patient } from "./Patient.ts";
import { Nurse } from "./Nurse.ts";
import { EpicPatient } from "./index.ts";

export interface Assignment {
  nurse: Nurse;
  patients: (Patient | EpicPatient)[];
  assignmentAcuityScore: number;
}

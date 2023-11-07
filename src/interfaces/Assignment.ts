import { Patient } from "./Patient.ts";
import { Nurse } from "./Nurse.ts";

export interface Assignment {
  nurse: Nurse;
  patients: Patient[];
}

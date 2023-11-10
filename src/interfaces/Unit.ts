import { Nurse } from "./Nurse.ts";
import { Patient } from "./Patient.ts";

export interface Unit {
  id: number;
  name: string;
  patients: Patient[];
  nurses: Nurse[];
}

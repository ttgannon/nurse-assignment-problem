/**
 * Frontend-facing unified types — mirrors server/src/types/index.ts.
 * Both the demo (local DB) and FHIR live paths resolve to these types
 * before any component touches the data.
 */

export interface NursifyUnit {
  id: number;
  name: string;
}

export interface NursifyNurse {
  id: number;
  name: string;
  yearsOfExperience: number;
  unitId: number;
}

export interface AcuityFactors {
  continent: boolean;
  independentlyMobile: boolean;
  numMeds: number;
  highRiskMeds: number;
  numDevices: number;
  numDrips: number;
  newTrach: boolean;
  tubeFeeds: boolean;
  woundCare: boolean;
}

export interface NursifyPatient {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  gender?: string;
  icd10?: string;
  unitId: number;
  acuityFactors: AcuityFactors;
  acuityScore?: number;
  source: "demo" | "fhir";
  fhirReference?: string;
}

export interface NursifyAssignment {
  nurse: NursifyNurse;
  patients: NursifyPatient[];
  assignmentAcuityScore: number;
}

export type AcuityLevel = "low" | "moderate" | "high" | "critical";

export function acuityLevel(score: number): AcuityLevel {
  if (score < 10) return "low";
  if (score < 20) return "moderate";
  if (score < 35) return "high";
  return "critical";
}

/**
 * Acuity scoring service.
 *
 * Computes a numeric acuity score for each NursifyPatient based on
 * clinical factors. Higher score = higher nursing workload.
 *
 * Weights are tuned for a general med-surg / PCU / telemetry context.
 * ICU-specific scoring (e.g. APACHE II) would require additional FHIR
 * data and can be layered in as a separate scoring profile.
 */

import type { AcuityFactors, NursifyPatient } from "../types";

// ─── Scoring weights ──────────────────────────────────────────────────────────

/** Each active medication adds this many points */
const WEIGHT_MED = 1;

/** Each high-alert medication (insulin, anticoagulant, vasopressor…) */
const WEIGHT_HIGH_RISK_MED = 4;

/** Each medical device (foley, NGT, chest tube, central line, PICC…) */
const WEIGHT_DEVICE = 5;

/** Each continuous IV infusion / drip */
const WEIGHT_DRIP = 4;

/** New tracheostomy — significant airway management burden */
const WEIGHT_NEW_TRACH = 5;

/** Enteral tube feeding — additional assessment and administration time */
const WEIGHT_TUBE_FEEDS = 4;

/** Active wound care orders */
const WEIGHT_WOUND_CARE = 4;

/**
 * Continent patient (no incontinence care needed).
 * Negative value because it reduces the nurse's workload.
 */
const WEIGHT_CONTINENT = -5;

/**
 * Independently mobile patient (ambulates without assist).
 * Negative value because it reduces the nurse's workload.
 */
const WEIGHT_INDEPENDENTLY_MOBILE = -6;

/**
 * Flat "patient-count" penalty added to each assignment bin regardless of
 * acuity so that nurses with very low-acuity patients are not overloaded
 * with sheer patient count.
 */
export const PATIENT_COUNT_PENALTY = 8;

// ─── Scoring function ─────────────────────────────────────────────────────────

export function computeAcuityScore(factors: AcuityFactors): number {
  let score = 0;

  if (factors.continent) score += WEIGHT_CONTINENT;
  if (factors.independentlyMobile) score += WEIGHT_INDEPENDENTLY_MOBILE;
  score += factors.numMeds * WEIGHT_MED;
  score += factors.highRiskMeds * WEIGHT_HIGH_RISK_MED;
  score += factors.numDevices * WEIGHT_DEVICE;
  score += factors.numDrips * WEIGHT_DRIP;
  if (factors.newTrach) score += WEIGHT_NEW_TRACH;
  if (factors.tubeFeeds) score += WEIGHT_TUBE_FEEDS;
  if (factors.woundCare) score += WEIGHT_WOUND_CARE;

  return score;
}

/**
 * Attaches acuityScore to each patient in-place and returns the array.
 */
export function scorePatients(patients: NursifyPatient[]): NursifyPatient[] {
  for (const patient of patients) {
    patient.acuityScore = computeAcuityScore(patient.acuityFactors);
  }
  return patients;
}

// ─── Score label helpers ──────────────────────────────────────────────────────

export type AcuityLevel = "low" | "moderate" | "high" | "critical";

/**
 * Maps a numeric score to a human-readable severity level.
 * Thresholds are approximate and can be adjusted per unit type.
 */
export function acuityLevel(score: number): AcuityLevel {
  if (score < 10) return "low";
  if (score < 20) return "moderate";
  if (score < 35) return "high";
  return "critical";
}

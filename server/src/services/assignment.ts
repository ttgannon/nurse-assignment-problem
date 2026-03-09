/**
 * Assignment engine.
 *
 * Uses a greedy, load-balanced bin-packing algorithm to distribute patients
 * across nurses as equitably as possible based on acuity score.
 *
 * Algorithm (O(p log n)):
 *  1. Score all patients (if not already scored).
 *  2. Sort patients descending by acuity score.
 *  3. Iterate over sorted patients; assign each to the nurse whose
 *     current assignment total is lowest.
 *  4. Each patient also contributes a flat PATIENT_COUNT_PENALTY so that
 *     a nurse with many low-acuity patients is not treated as "empty".
 */

import { scorePatients, PATIENT_COUNT_PENALTY } from "./acuity";
import type { NursifyAssignment, NursifyNurse, NursifyPatient } from "../types";

export function generateAssignments(
  patients: NursifyPatient[],
  nurses: NursifyNurse[]
): NursifyAssignment[] {
  if (nurses.length === 0) return [];

  // Score patients (idempotent if already scored)
  const scored = scorePatients([...patients]);

  // Descending sort — highest acuity patients get placed first so that
  // they are spread across nurses before the lighter patients fill gaps.
  scored.sort((a, b) => (b.acuityScore ?? 0) - (a.acuityScore ?? 0));

  // One bin per nurse, tracking running total
  const bins: Array<{
    nurse: NursifyNurse;
    patients: NursifyPatient[];
    total: number;
  }> = nurses.map((nurse) => ({ nurse, patients: [], total: 0 }));

  // Min-bin selection (linear scan — fast enough for ≤ 100 nurses)
  function minBinIndex(): number {
    let min = 0;
    for (let i = 1; i < bins.length; i++) {
      if (bins[i].total < bins[min].total) min = i;
    }
    return min;
  }

  for (const patient of scored) {
    const idx = minBinIndex();
    bins[idx].patients.push(patient);
    bins[idx].total += (patient.acuityScore ?? 0) + PATIENT_COUNT_PENALTY;
  }

  return bins.map(({ nurse, patients, total }) => ({
    nurse,
    patients,
    assignmentAcuityScore: total,
  }));
}

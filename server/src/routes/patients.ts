/**
 * Patient routes.
 *
 * GET /api/patients?unitId={id}        → demo patients from local DB
 * GET /api/patients/fhir?locationId={} → FHIR R4 patients + enriched acuity
 * POST /api/patients/assign            → run assignment engine, return results
 */

import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { generateAssignments } from "../services/assignment";
import {
  getFhirPatientsByLocation,
  fhirFetch,
  isHighRiskMedication,
  isIvDrip,
  isIndependentlyMobile,
  hasWoundCare,
  hasNewTrach,
  hasTubeFeeds,
  type FhirBundle,
  type FhirMedicationRequest,
  type FhirObservation,
  type FhirDevice,
  type FhirProcedure,
} from "../services/fhir";
import type { NursifyPatient, NursifyNurse, AcuityFactors } from "../types";
import { computeAcuityScore } from "../services/acuity";

export const patientsRouter = Router();

// ─── Helper: map DB patient → NursifyPatient ──────────────────────────────────

function dbPatientToNursify(p: {
  id: number;
  patient_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  icd_10: string;
  unit_id: number;
  continent: boolean;
  independently_mobile: boolean;
  num_meds: number;
  high_risk_meds: number;
  num_devices: number;
  num_drips: number;
  new_trach: number;
  tube_feeds: number;
  wound_care: number;
}): NursifyPatient {
  const factors = {
    continent: p.continent,
    independentlyMobile: p.independently_mobile,
    numMeds: p.num_meds,
    highRiskMeds: p.high_risk_meds,
    numDevices: p.num_devices,
    numDrips: p.num_drips,
    newTrach: p.new_trach > 0,
    tubeFeeds: p.tube_feeds > 0,
    woundCare: p.wound_care > 0,
  };
  return {
    id: String(p.id),
    firstName: p.first_name,
    lastName: p.last_name,
    displayName: `${p.first_name} ${p.last_name}`,
    gender: p.gender,
    icd10: p.icd_10,
    unitId: p.unit_id,
    source: "demo",
    acuityFactors: factors,
    acuityScore: computeAcuityScore(factors),
  };
}

// ─── GET /api/patients?unitId={id} ───────────────────────────────────────────

patientsRouter.get("/", async (req: Request, res: Response) => {
  const unitId = req.query.unitId ? Number(req.query.unitId) : undefined;

  const patients = await prisma.patient.findMany({
    where: unitId !== undefined ? { unit_id: unitId } : undefined,
    orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
  });

  return res.json(patients.map(dbPatientToNursify));
});

// ─── GET /api/patients/fhir?locationId={} ────────────────────────────────────
// Fetches patients from the FHIR server and enriches them with
// acuity factors by querying related FHIR resources per patient.

patientsRouter.get("/fhir", async (req: Request, res: Response) => {
  const auth = req.session.auth;
  if (!auth) {
    return res.status(401).json({ error: "Not authenticated with a FHIR server." });
  }
  if (Date.now() > auth.expiresAt) {
    return res.status(401).json({ error: "FHIR token has expired. Please log in again." });
  }

  const locationId = req.query.locationId as string | undefined;
  if (!locationId) {
    return res.status(400).json({ error: "locationId query parameter is required." });
  }

  try {
    const fhirPatients = await getFhirPatientsByLocation(
      auth.fhirBaseUrl,
      locationId,
      auth.accessToken
    );

    // Enrich each patient with clinical acuity data (parallel per patient)
    const enriched = await Promise.all(
      fhirPatients.map(async (fhirPt): Promise<NursifyPatient> => {
        const patientId = fhirPt.id ?? "";
        const base = auth.fhirBaseUrl;
        const token = auth.accessToken;

        const [medBundle, obsBundle, deviceBundle, procBundle] =
          await Promise.allSettled([
            fhirFetch<FhirBundle<FhirMedicationRequest>>(
              base,
              `/MedicationRequest?patient=${patientId}&status=active&_count=100`,
              token
            ),
            fhirFetch<FhirBundle<FhirObservation>>(
              base,
              `/Observation?patient=${patientId}&category=survey&_count=50`,
              token
            ),
            fhirFetch<FhirBundle<FhirDevice>>(
              base,
              `/Device?patient=${patientId}&status=active&_count=50`,
              token
            ),
            fhirFetch<FhirBundle<FhirProcedure>>(
              base,
              `/Procedure?patient=${patientId}&status=in-progress&_count=50`,
              token
            ),
          ]);

        const meds =
          medBundle.status === "fulfilled"
            ? (medBundle.value.entry ?? []).map((e) => e.resource!).filter(Boolean)
            : [];
        const observations =
          obsBundle.status === "fulfilled"
            ? (obsBundle.value.entry ?? []).map((e) => e.resource!).filter(Boolean)
            : [];
        const devices =
          deviceBundle.status === "fulfilled"
            ? (deviceBundle.value.entry ?? []).map((e) => e.resource!).filter(Boolean)
            : [];
        const procedures =
          procBundle.status === "fulfilled"
            ? (procBundle.value.entry ?? []).map((e) => e.resource!).filter(Boolean)
            : [];

        const highRiskMedCount = meds.filter(isHighRiskMedication).length;
        const dripCount = meds.filter(isIvDrip).length;

        const namePart = fhirPt.name?.[0];
        const firstName = namePart?.given?.[0] ?? "Unknown";
        const lastName = namePart?.family ?? "Patient";

        const factors: AcuityFactors = {
          continent: true, // Default; no reliable FHIR code for continence in all servers
          independentlyMobile: isIndependentlyMobile(observations),
          numMeds: meds.length,
          highRiskMeds: highRiskMedCount,
          numDevices: devices.length,
          numDrips: dripCount,
          newTrach: hasNewTrach(procedures),
          tubeFeeds: hasTubeFeeds(procedures),
          woundCare: hasWoundCare(procedures),
        };

        return {
          id: patientId,
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`,
          gender: fhirPt.gender,
          unitId: Number(locationId) || 0,
          source: "fhir",
          fhirReference: `Patient/${patientId}`,
          acuityFactors: factors,
        };
      })
    );

    return res.json(enriched);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(502).json({ error: `FHIR enrichment failed: ${message}` });
  }
});

// ─── POST /api/patients/assign ────────────────────────────────────────────────
// Body: { patients: NursifyPatient[], nurses: NursifyNurse[] }

interface AssignBody {
  patients: NursifyPatient[];
  nurses: NursifyNurse[];
}

patientsRouter.post("/assign", (req: Request, res: Response) => {
  const { patients, nurses } = req.body as AssignBody;

  if (!Array.isArray(patients) || !Array.isArray(nurses)) {
    return res.status(400).json({ error: "patients and nurses arrays are required." });
  }

  if (nurses.length === 0) {
    return res.status(400).json({ error: "At least one nurse is required." });
  }

  const assignments = generateAssignments(patients, nurses);
  return res.json(assignments);
});

import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { getFhirLocations } from "../services/fhir";
import type { NursifyUnit } from "../types";

export const unitsRouter = Router();

// ─── GET /api/units ───────────────────────────────────────────────────────────
// Returns all units from the local demo database.

unitsRouter.get("/", async (_req: Request, res: Response) => {
  const units = await prisma.unit.findMany({ orderBy: { unit_name: "asc" } });
  const response: NursifyUnit[] = units.map((u) => ({
    id: u.id,
    name: u.unit_name,
  }));
  return res.json(response);
});

// ─── GET /api/units/fhir ──────────────────────────────────────────────────────
// Returns active Location resources from the authenticated FHIR server.

unitsRouter.get("/fhir", async (req: Request, res: Response) => {
  const auth = req.session.auth;
  if (!auth) {
    return res.status(401).json({ error: "Not authenticated with a FHIR server." });
  }
  if (Date.now() > auth.expiresAt) {
    return res.status(401).json({ error: "FHIR token has expired. Please log in again." });
  }

  try {
    const locations = await getFhirLocations(auth.fhirBaseUrl, auth.accessToken);
    const response: NursifyUnit[] = locations.map((loc) => ({
      id: loc.id ?? "",
      name: loc.name ?? loc.id ?? "Unknown Unit",
    }));
    return res.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(502).json({ error: `FHIR request failed: ${message}` });
  }
});

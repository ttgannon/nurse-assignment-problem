import { Router, Request, Response } from "express";
import { prisma } from "../db";
import type { NursifyNurse } from "../types";

export const nursesRouter = Router();

// ─── GET /api/nurses?unitId={id} ──────────────────────────────────────────────

nursesRouter.get("/", async (req: Request, res: Response) => {
  const unitId = req.query.unitId ? Number(req.query.unitId) : undefined;

  const nurses = await prisma.nurse.findMany({
    where: unitId !== undefined ? { unit_id: unitId } : undefined,
    include: { unit: true },
    orderBy: { nurse_name: "asc" },
  });

  const response: NursifyNurse[] = nurses.map((n) => ({
    id: n.id,
    name: n.nurse_name,
    yearsOfExperience: n.years_exp,
    unitId: n.unit_id,
  }));

  return res.json(response);
});

// ─── POST /api/nurses ─────────────────────────────────────────────────────────

interface CreateNurseBody {
  nurse_name: string;
  years_exp?: number;
  unit_id: number;
}

nursesRouter.post("/", async (req: Request, res: Response) => {
  const { nurse_name, years_exp, unit_id } = req.body as CreateNurseBody;

  if (!nurse_name || !unit_id) {
    return res.status(400).json({ error: "nurse_name and unit_id are required." });
  }

  const nurse = await prisma.nurse.create({
    data: { nurse_name, years_exp: years_exp ?? 0, unit_id },
  });

  const response: NursifyNurse = {
    id: nurse.id,
    name: nurse.nurse_name,
    yearsOfExperience: nurse.years_exp,
    unitId: nurse.unit_id,
  };

  return res.status(201).json(response);
});

// ─── DELETE /api/nurses/:id ───────────────────────────────────────────────────

nursesRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid nurse id." });

  try {
    await prisma.nurse.delete({ where: { id } });
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Nurse not found." });
  }
});

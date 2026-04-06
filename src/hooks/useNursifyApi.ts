/**
 * Data-fetching hooks for the Nursify backend API.
 * All functions call the new TypeScript Express server (server/).
 */

import { API_BASE_URL } from "@/api";
import type {
  NursifyUnit,
  NursifyNurse,
  NursifyPatient,
  NursifyAssignment,
} from "@/types/nursify";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (body as { error?: string }).error ?? `API error ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export async function fetchUnits(): Promise<NursifyUnit[]> {
  return apiFetch<NursifyUnit[]>("/api/units");
}

export async function fetchNurses(unitId: number): Promise<NursifyNurse[]> {
  return apiFetch<NursifyNurse[]>(`/api/nurses?unitId=${unitId}`);
}

export async function fetchPatients(unitId: number): Promise<NursifyPatient[]> {
  return apiFetch<NursifyPatient[]>(`/api/patients?unitId=${unitId}`);
}

export async function generateAssignments(
  patients: NursifyPatient[],
  nurses: NursifyNurse[],
): Promise<NursifyAssignment[]> {
  return apiFetch<NursifyAssignment[]>("/api/patients/assign", {
    method: "POST",
    body: JSON.stringify({ patients, nurses }),
  });
}

export async function addNurse(
  nurse_name: string,
  years_exp: number,
  unit_id: number,
): Promise<NursifyNurse> {
  return apiFetch<NursifyNurse>("/api/nurses", {
    method: "POST",
    body: JSON.stringify({ nurse_name, years_exp, unit_id }),
  });
}

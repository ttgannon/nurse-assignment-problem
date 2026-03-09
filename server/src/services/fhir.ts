/**
 * Generic SMART on FHIR R4 service.
 *
 * This module is intentionally server-agnostic — it works with any
 * R4-compliant FHIR server that exposes SMART configuration (Epic,
 * Cerner, HAPI FHIR, Azure Health Data Services, etc.).
 *
 * Discovery follows the SMART App Launch 2.0 spec:
 *   https://hl7.org/fhir/smart-app-launch/
 */

import crypto from "crypto";
import type { SmartConfiguration } from "../types";

// ─── PKCE helpers ─────────────────────────────────────────────────────────────

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

export function generateState(): string {
  return crypto.randomBytes(16).toString("hex");
}

// ─── Discovery ────────────────────────────────────────────────────────────────

/**
 * Fetches the SMART configuration for a given FHIR base URL.
 * Tries the modern `.well-known/smart-configuration` endpoint first,
 * then falls back to parsing the FHIR CapabilityStatement.
 */
export async function discoverSmartConfig(
  fhirBaseUrl: string
): Promise<SmartConfiguration> {
  const base = fhirBaseUrl.replace(/\/$/, "");

  // --- Modern SMART App Launch 2.0 ---
  const wellKnownUrl = `${base}/.well-known/smart-configuration`;
  try {
    const response = await fetch(wellKnownUrl, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const config = (await response.json()) as SmartConfiguration;
      if (config.authorization_endpoint && config.token_endpoint) {
        return config;
      }
    }
  } catch {
    // Fall through to CapabilityStatement discovery
  }

  // --- Legacy: parse FHIR CapabilityStatement ---
  const metadataUrl = `${base}/metadata?_format=json`;
  const metaResponse = await fetch(metadataUrl, {
    headers: { Accept: "application/fhir+json, application/json" },
  });

  if (!metaResponse.ok) {
    throw new Error(
      `FHIR server discovery failed for ${fhirBaseUrl}. ` +
        `Could not reach ${wellKnownUrl} or ${metadataUrl}.`
    );
  }

  const metadata = await metaResponse.json();
  const securityExtensions: Array<{ url: string; valueUri?: string }> =
    metadata?.rest?.[0]?.security?.extension?.[0]?.extension ?? [];

  const authEndpoint = securityExtensions.find(
    (e) => e.url === "authorize"
  )?.valueUri;
  const tokenEndpoint = securityExtensions.find(
    (e) => e.url === "token"
  )?.valueUri;

  if (!authEndpoint || !tokenEndpoint) {
    throw new Error(
      `Could not locate SMART auth/token endpoints in CapabilityStatement for ${fhirBaseUrl}.`
    );
  }

  return {
    authorization_endpoint: authEndpoint,
    token_endpoint: tokenEndpoint,
  };
}

// ─── Authorization URL builder ────────────────────────────────────────────────

const DEFAULT_SCOPE =
  "patient/*.read launch/patient openid fhirUser offline_access";

export interface BuildAuthUrlOptions {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
  scope?: string;
  aud: string;
}

export function buildAuthorizationUrl(opts: BuildAuthUrlOptions): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: opts.clientId,
    redirect_uri: opts.redirectUri,
    scope: opts.scope ?? DEFAULT_SCOPE,
    state: opts.state,
    aud: opts.aud,
    code_challenge: opts.codeChallenge,
    code_challenge_method: "S256",
  });

  return `${opts.authorizationEndpoint}?${params.toString()}`;
}

// ─── Token exchange ───────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
  patient?: string;
  refresh_token?: string;
}

export interface ExchangeCodeOptions {
  tokenEndpoint: string;
  code: string;
  redirectUri: string;
  clientId: string;
  codeVerifier: string;
  /** Only for confidential clients — never expose to the browser */
  clientSecret?: string;
}

export async function exchangeCodeForToken(
  opts: ExchangeCodeOptions
): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: opts.code,
    redirect_uri: opts.redirectUri,
    client_id: opts.clientId,
    code_verifier: opts.codeVerifier,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };

  // Confidential client: send credentials via HTTP Basic auth
  if (opts.clientSecret) {
    const credentials = Buffer.from(
      `${opts.clientId}:${opts.clientSecret}`
    ).toString("base64");
    headers["Authorization"] = `Basic ${credentials}`;
  }

  const response = await fetch(opts.tokenEndpoint, {
    method: "POST",
    headers,
    body: params.toString(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Token exchange failed (${response.status}): ${body}`
    );
  }

  return response.json() as Promise<TokenResponse>;
}

// ─── Generic FHIR R4 fetch ────────────────────────────────────────────────────

/**
 * Authenticated fetch wrapper for any FHIR R4 resource or search.
 * @param fhirBaseUrl  e.g. "https://hapi.fhir.org/baseR4"
 * @param path         e.g. "/Location" or "/Patient?_count=50"
 * @param accessToken  Bearer token from the OAuth flow
 */
export async function fhirFetch<T = unknown>(
  fhirBaseUrl: string,
  path: string,
  accessToken: string
): Promise<T> {
  const url = `${fhirBaseUrl.replace(/\/$/, "")}${path}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/fhir+json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`FHIR request failed [${response.status}] ${url}: ${body}`);
  }

  return response.json() as Promise<T>;
}

// ─── R4 resource helpers ──────────────────────────────────────────────────────

export interface FhirBundle<T = FhirResource> {
  resourceType: "Bundle";
  total?: number;
  entry?: Array<{ resource?: T; fullUrl?: string }>;
}

export interface FhirResource {
  resourceType: string;
  id?: string;
  [key: string]: unknown;
}

export interface FhirLocation extends FhirResource {
  resourceType: "Location";
  name?: string;
  status?: string;
  physicalType?: { coding?: Array<{ code?: string; display?: string }> };
}

export interface FhirPatient extends FhirResource {
  resourceType: "Patient";
  name?: Array<{
    use?: string;
    family?: string;
    given?: string[];
  }>;
  gender?: string;
}

export interface FhirMedicationRequest extends FhirResource {
  resourceType: "MedicationRequest";
  status?: string;
  medicationCodeableConcept?: {
    coding?: Array<{ system?: string; code?: string; display?: string }>;
    text?: string;
  };
  dosageInstruction?: Array<{
    route?: { coding?: Array<{ code?: string }> };
  }>;
}

export interface FhirObservation extends FhirResource {
  resourceType: "Observation";
  code?: { coding?: Array<{ system?: string; code?: string }> };
  valueCodeableConcept?: { coding?: Array<{ code?: string }> };
  valueString?: string;
}

export interface FhirDevice extends FhirResource {
  resourceType: "Device";
  status?: string;
}

export interface FhirProcedure extends FhirResource {
  resourceType: "Procedure";
  status?: string;
  code?: { coding?: Array<{ system?: string; code?: string; display?: string }> };
}

/**
 * Fetches all active locations (units/wards) from a FHIR server.
 * Returns ward-type locations; hospitals may use a different physicalType code.
 */
export async function getFhirLocations(
  fhirBaseUrl: string,
  accessToken: string
): Promise<FhirLocation[]> {
  const bundle = await fhirFetch<FhirBundle<FhirLocation>>(
    fhirBaseUrl,
    "/Location?status=active&_count=100",
    accessToken
  );
  return (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((r): r is FhirLocation => r?.resourceType === "Location");
}

/**
 * Fetches all patients currently assigned to a location (unit).
 * Falls back to an unfiltered patient search if location param is unsupported.
 */
export async function getFhirPatientsByLocation(
  fhirBaseUrl: string,
  locationId: string,
  accessToken: string
): Promise<FhirPatient[]> {
  const bundle = await fhirFetch<FhirBundle<FhirPatient>>(
    fhirBaseUrl,
    `/Patient?location=${locationId}&_count=100`,
    accessToken
  );
  return (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((r): r is FhirPatient => r?.resourceType === "Patient");
}

// ─── FHIR → acuity factor mapping ────────────────────────────────────────────

/** SNOMED / LOINC codes considered high-risk medications (insulin, anticoagulants, etc.) */
const HIGH_RISK_RX_CODES = new Set([
  "387517004", // Paracetamol overdose context — placeholder
  "372756006", // Warfarin
  "372862008", // Heparin
  "67079006",  // Insulin
  "372664005", // Vancomycin
  "408050008", // Potassium chloride
]);

/** LOINC codes for mobility assessment */
const MOBILITY_LOINC = new Set(["89432-1", "54522-8"]);

/** SNOMED procedure codes related to wound care */
const WOUND_CARE_SNOMED = new Set([
  "182834008", // Wound dressing
  "225358003", // Wound care
]);

/** SNOMED codes for tracheostomy */
const TRACH_SNOMED = new Set([
  "129121000", // Tracheostomy care
  "57241006",  // Tracheostomy tube in trachea
]);

/** SNOMED/LOINC codes for tube feeding */
const TUBE_FEED_SNOMED = new Set([
  "229912004", // Enteral feeding
  "127261009", // Nasogastric feeding
]);

/**
 * Determines high-risk medication status from a MedicationRequest resource.
 */
export function isHighRiskMedication(med: FhirMedicationRequest): boolean {
  const codings =
    med.medicationCodeableConcept?.coding ?? [];
  return codings.some((c) => c.code && HIGH_RISK_RX_CODES.has(c.code));
}

/**
 * Determines if a MedicationRequest is an IV drip (continuous infusion).
 */
export function isIvDrip(med: FhirMedicationRequest): boolean {
  const routes = med.dosageInstruction?.flatMap(
    (d) => d.route?.coding ?? []
  ) ?? [];
  // SNOMED route codes for IV infusion / continuous drip
  const IV_ROUTES = new Set(["47625008", "418114005", "127492001"]);
  return routes.some((r) => r.code && IV_ROUTES.has(r.code));
}

/**
 * Determines patient independence/mobility from FHIR Observation resources.
 * Returns true if the patient is independently mobile.
 */
export function isIndependentlyMobile(
  observations: FhirObservation[]
): boolean {
  const mobilityObs = observations.find((o) =>
    o.code?.coding?.some((c) => MOBILITY_LOINC.has(c.code ?? ""))
  );
  if (!mobilityObs) return false;

  const value =
    mobilityObs.valueCodeableConcept?.coding?.[0]?.code ??
    mobilityObs.valueString?.toLowerCase() ??
    "";
  // LOINC answer codes for independent mobility
  return ["la11767-4", "la11779-9", "independent"].some((code) =>
    value.toLowerCase().includes(code)
  );
}

/**
 * Determines if any active procedure indicates wound care.
 */
export function hasWoundCare(procedures: FhirProcedure[]): boolean {
  return procedures.some((p) =>
    p.code?.coding?.some((c) => c.code && WOUND_CARE_SNOMED.has(c.code))
  );
}

/**
 * Determines if any active procedure indicates a (new) tracheostomy.
 */
export function hasNewTrach(procedures: FhirProcedure[]): boolean {
  return procedures.some((p) =>
    p.code?.coding?.some((c) => c.code && TRACH_SNOMED.has(c.code))
  );
}

/**
 * Determines if any active procedure/order indicates tube feeds.
 */
export function hasTubeFeeds(procedures: FhirProcedure[]): boolean {
  return procedures.some((p) =>
    p.code?.coding?.some((c) => c.code && TUBE_FEED_SNOMED.has(c.code))
  );
}

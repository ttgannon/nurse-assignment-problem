/**
 * Unified Nursify types — the single source of truth shared by the demo
 * (local DB) path and the FHIR live path. Both data sources map into
 * these types before reaching the assignment engine.
 */

// ─── Core domain types ───────────────────────────────────────────────────────

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

/**
 * Clinical acuity factors used by the scoring algorithm.
 * These can be populated from the local DB (demo) or derived
 * from FHIR R4 resources (live).
 */
export interface AcuityFactors {
  /** Patient does NOT require assistance with toileting (reduces load) */
  continent: boolean;
  /** Patient can move independently (reduces load) */
  independentlyMobile: boolean;
  /** Total active medications */
  numMeds: number;
  /** High-alert medications (insulin, anticoagulants, vasopressors, etc.) */
  highRiskMeds: number;
  /** Medical devices (foley, NGT, chest tube, central line, etc.) */
  numDevices: number;
  /** Continuous IV infusions / drips */
  numDrips: number;
  /** New (post-operative) tracheostomy */
  newTrach: boolean;
  /** Enteral tube feeding */
  tubeFeeds: boolean;
  /** Active wound care order */
  woundCare: boolean;
}

export interface NursifyPatient {
  /** Stable internal identifier (DB id or FHIR patient id) */
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  gender?: string;
  /** Primary ICD-10 diagnosis code */
  icd10?: string;
  unitId: number;
  acuityFactors: AcuityFactors;
  /** Computed by the acuity service; undefined until scored */
  acuityScore?: number;
  /** Which path produced this record */
  source: "demo" | "fhir";
  /** FHIR-only: reference string from the List resource entry */
  fhirReference?: string;
}

// ─── Assignment types ─────────────────────────────────────────────────────────

export interface NursifyAssignment {
  nurse: NursifyNurse;
  patients: NursifyPatient[];
  assignmentAcuityScore: number;
}

// ─── SMART on FHIR discovery ─────────────────────────────────────────────────

export interface SmartConfiguration {
  issuer?: string;
  authorization_endpoint: string;
  token_endpoint: string;
  token_endpoint_auth_methods_supported?: string[];
  registration_endpoint?: string;
  scopes_supported?: string[];
  response_types_supported?: string[];
  capabilities?: string[];
  code_challenge_methods_supported?: string[];
}

/** Persisted in the server-side session during the OAuth flow */
export interface OAuthPendingState {
  state: string;
  codeVerifier: string;
  fhirBaseUrl: string;
  tokenEndpoint: string;
  authorizationEndpoint: string;
}

/** What we store in session once authenticated */
export interface AuthenticatedSession {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  fhirBaseUrl: string;
  scope?: string;
  patient?: string;
}

// ─── Express session augmentation ────────────────────────────────────────────

declare module "express-session" {
  interface SessionData {
    pending?: OAuthPendingState;
    auth?: AuthenticatedSession;
  }
}

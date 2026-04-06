/**
 * Frontend configuration.
 *
 * Only PUBLIC, non-sensitive values live here.
 * The FHIR client secret and all token exchange logic live
 * exclusively on the backend (server/src/routes/auth.ts).
 *
 * This file is still gitignored (api.tsx) to prevent accidental
 * leakage if someone adds secrets back — all values should come from
 * Vite env variables (VITE_ prefix).
 */

/** Base URL of the Nursify backend API */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000";

/**
 * The URL the FHIR authorization server redirects to after the user
 * authenticates. Must exactly match the value registered in the SMART
 * app configuration AND in the server's FHIR_REDIRECT_URI env var.
 */
export const FHIR_REDIRECT_URI: string =
  (import.meta.env.VITE_FHIR_REDIRECT_URI as string | undefined) ??
  "http://localhost:5174/auth/callback";

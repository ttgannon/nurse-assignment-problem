/**
 * SMART on FHIR launch service — frontend side.
 *
 * This module only handles:
 *  1. Asking the backend to discover SMART config and get an authorization URL
 *  2. Exchanging the auth code for a session by posting it to the backend
 *
 * Token exchange, PKCE, and CLIENT_SECRET all live exclusively on the backend.
 * The browser never sees the token or the secret.
 */

import { API_BASE_URL } from "../api";

/**
 * Step 1: Initiate login for a given FHIR server.
 *
 * The backend discovers the SMART configuration for `fhirBaseUrl`,
 * generates a PKCE challenge + state, stores them in a server-side session,
 * and returns the authorization URL to redirect the user to.
 *
 * @returns The authorization URL to redirect the browser to.
 */
export async function initiateSmartLogin(fhirBaseUrl: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/launch`, {
    method: "POST",
    credentials: "include", // Send session cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fhirBaseUrl }),
  });

  if (!response.ok) {
    const { error } = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error((error as string) ?? `Launch failed (${response.status})`);
  }

  const { authorizationUrl } = (await response.json()) as {
    authorizationUrl: string;
  };
  return authorizationUrl;
}

/**
 * Step 2: Exchange the authorization code for a server-side session.
 *
 * Called after the FHIR server redirects back to the frontend with
 * `?code=...&state=...` in the URL. The frontend passes both values
 * to the backend, which validates the state and exchanges the code.
 *
 * On success, the backend sets an httpOnly session cookie. The frontend
 * does not receive the raw access token.
 *
 * @returns Metadata from the token response (fhirBaseUrl, scope, patient).
 */
export async function exchangeAuthCode(
  code: string,
  state: string
): Promise<{ fhirBaseUrl: string; scope?: string; patient?: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/callback`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, state }),
  });

  if (!response.ok) {
    const { error } = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      (error as string) ?? `Auth callback failed (${response.status})`
    );
  }

  return response.json() as Promise<{
    fhirBaseUrl: string;
    scope?: string;
    patient?: string;
  }>;
}

/**
 * Check whether the current browser session is authenticated with a FHIR server.
 */
export async function getAuthStatus(): Promise<{
  authenticated: boolean;
  fhirBaseUrl?: string;
  scope?: string;
  expiresAt?: number;
}> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });
  return response.json() as Promise<{
    authenticated: boolean;
    fhirBaseUrl?: string;
    scope?: string;
    expiresAt?: number;
  }>;
}

/**
 * Log out — destroys the server-side session and clears the cookie.
 */
export async function logout(): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

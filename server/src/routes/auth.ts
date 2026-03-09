/**
 * SMART on FHIR authentication routes.
 *
 * Flow:
 *  1. POST /api/auth/launch   → discover SMART config, return authorizationUrl
 *  2. POST /api/auth/callback → exchange code for token, store in session
 *  3. GET  /api/auth/me       → return current session state
 *  4. POST /api/auth/logout   → clear session
 *
 * The CLIENT_SECRET never leaves the server. PKCE (S256) is used for all
 * clients to protect the authorization code in transit.
 */

import { Router, Request, Response } from "express";
import {
  discoverSmartConfig,
  buildAuthorizationUrl,
  exchangeCodeForToken,
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from "../services/fhir";

export const authRouter = Router();

// ─── POST /api/auth/launch ────────────────────────────────────────────────────

interface LaunchBody {
  fhirBaseUrl: string;
}

authRouter.post("/launch", async (req: Request, res: Response) => {
  const { fhirBaseUrl } = req.body as LaunchBody;

  if (!fhirBaseUrl || typeof fhirBaseUrl !== "string") {
    return res.status(400).json({ error: "fhirBaseUrl is required" });
  }

  const clientId = process.env.FHIR_CLIENT_ID;
  const redirectUri = process.env.FHIR_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      error: "Server FHIR_CLIENT_ID or FHIR_REDIRECT_URI is not configured.",
    });
  }

  try {
    const smartConfig = await discoverSmartConfig(fhirBaseUrl);

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();

    // Persist the pending OAuth state server-side (never exposed to browser)
    req.session.pending = {
      state,
      codeVerifier,
      fhirBaseUrl,
      tokenEndpoint: smartConfig.token_endpoint,
      authorizationEndpoint: smartConfig.authorization_endpoint,
    };

    const authorizationUrl = buildAuthorizationUrl({
      authorizationEndpoint: smartConfig.authorization_endpoint,
      clientId,
      redirectUri,
      state,
      codeChallenge,
      aud: fhirBaseUrl,
    });

    return res.json({ authorizationUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(502).json({ error: `FHIR discovery failed: ${message}` });
  }
});

// ─── POST /api/auth/callback ──────────────────────────────────────────────────

interface CallbackBody {
  code: string;
  state: string;
}

authRouter.post("/callback", async (req: Request, res: Response) => {
  const { code, state } = req.body as CallbackBody;

  if (!code || !state) {
    return res.status(400).json({ error: "code and state are required" });
  }

  const pending = req.session.pending;

  if (!pending) {
    return res.status(400).json({
      error: "No pending OAuth session found. Start the flow with /api/auth/launch.",
    });
  }

  if (pending.state !== state) {
    // State mismatch — possible CSRF attack; abort immediately
    delete req.session.pending;
    return res.status(400).json({ error: "OAuth state mismatch. Please try again." });
  }

  const clientId = process.env.FHIR_CLIENT_ID!;
  const redirectUri = process.env.FHIR_REDIRECT_URI!;
  const clientSecret = process.env.FHIR_CLIENT_SECRET; // Optional for public clients

  try {
    const tokenResponse = await exchangeCodeForToken({
      tokenEndpoint: pending.tokenEndpoint,
      code,
      redirectUri,
      clientId,
      codeVerifier: pending.codeVerifier,
      clientSecret,
    });

    // Move from pending → authenticated; clear pending
    delete req.session.pending;
    req.session.auth = {
      accessToken: tokenResponse.access_token,
      tokenType: tokenResponse.token_type,
      expiresAt: tokenResponse.expires_in
        ? Date.now() + tokenResponse.expires_in * 1000
        : Date.now() + 3600 * 1000,
      fhirBaseUrl: pending.fhirBaseUrl,
      scope: tokenResponse.scope,
      patient: tokenResponse.patient,
    };

    return res.json({
      ok: true,
      fhirBaseUrl: pending.fhirBaseUrl,
      scope: tokenResponse.scope,
      patient: tokenResponse.patient,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    delete req.session.pending;
    return res.status(502).json({ error: `Token exchange failed: ${message}` });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

authRouter.get("/me", (req: Request, res: Response) => {
  const auth = req.session.auth;

  if (!auth) {
    return res.json({ authenticated: false });
  }

  const expired = Date.now() > auth.expiresAt;
  if (expired) {
    delete req.session.auth;
    return res.json({ authenticated: false, reason: "token_expired" });
  }

  return res.json({
    authenticated: true,
    fhirBaseUrl: auth.fhirBaseUrl,
    scope: auth.scope,
    patient: auth.patient,
    expiresAt: auth.expiresAt,
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────

authRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not destroy session." });
    }
    res.clearCookie("nursify.sid");
    return res.json({ ok: true });
  });
});

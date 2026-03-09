/**
 * Auth component — SMART on FHIR login flow.
 *
 * Exports two components:
 *  - Auth: "Sign in" button + dialog for selecting a FHIR server
 *  - AuthCallback: handles the /auth/callback redirect, exchanges code for token
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  initiateSmartLogin,
  exchangeAuthCode,
  getAuthStatus,
} from "@/services/launch";

// Known public FHIR sandboxes for the quick-pick dropdown
const FHIR_SANDBOXES = [
  {
    label: "SMART Health IT Sandbox (R4)",
    url: "https://launch.smarthealthit.org/v/r4/fhir",
  },
  {
    label: "HAPI FHIR Public Test Server (R4)",
    url: "https://hapi.fhir.org/baseR4",
  },
  {
    label: "Epic FHIR Sandbox",
    url: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
  },
  { label: "Custom server…", url: "__custom__" },
];

// ─── Callback handler (rendered at /auth/callback) ────────────────────────────

export const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [, setLoggedIn] = useOutletContext<[boolean, (v: boolean) => void]>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code || !state) {
      setError("Missing code or state in callback URL.");
      return;
    }

    exchangeAuthCode(code, state)
      .then(() => {
        setLoggedIn(true);
        navigate("/assignment");
      })
      .catch((err: Error) => setError(err.message));
  }, [location.search, navigate, setLoggedIn]);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm font-medium text-destructive">
          Authentication failed: {error}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <Spinner size="md" />
      <p className="text-sm text-muted-foreground">Completing sign-in…</p>
    </div>
  );
};

// ─── Sign-in button + dialog ──────────────────────────────────────────────────

export const Auth = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(FHIR_SANDBOXES[0].url);
  const [customUrl, setCustomUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-authenticated users
  useEffect(() => {
    getAuthStatus().then(({ authenticated }) => {
      if (authenticated) navigate("/assignment");
    });
  }, [navigate]);

  const fhirBaseUrl =
    selectedPreset !== "__custom__" ? selectedPreset : customUrl.trim();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!fhirBaseUrl) {
      setError("Please enter or select a FHIR server URL.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const authUrl = await initiateSmartLogin(fhirBaseUrl);
      window.location.href = authUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
        onClick={() => setOpen(true)}
      >
        Sign in with FHIR
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to your EHR</DialogTitle>
            <DialogDescription>
              Select a SMART on FHIR R4-compliant server to authenticate
              against.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSignIn} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>FHIR server</Label>
              <Select
                value={selectedPreset}
                onValueChange={(v) => {
                  setSelectedPreset(v);
                  setError(null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FHIR_SANDBOXES.map((s) => (
                    <SelectItem key={s.url} value={s.url}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPreset === "__custom__" && (
              <div className="space-y-1.5">
                <Label htmlFor="custom-fhir">Custom FHIR base URL</Label>
                <Input
                  id="custom-fhir"
                  type="url"
                  placeholder="https://your-fhir-server.example.com/baseR4"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Must be a SMART on FHIR R4-compliant server.
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Spinner size="sm" />}
                {loading ? "Connecting…" : "Sign in"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

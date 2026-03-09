/**
 * LoggedInAssignment — Phase 3 (FHIR-authenticated assignment view).
 * Placeholder until the full redesign is complete.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const LoggedInAssignment = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
    <h1 className="text-xl font-semibold text-slate-900">
      EHR Assignment View
    </h1>
    <p className="max-w-sm text-sm text-muted-foreground">
      The FHIR-authenticated assignment board is coming in Phase 3.
      Try the demo to see the full assignment algorithm in action.
    </p>
    <Link to="/demo">
      <Button>Try the demo</Button>
    </Link>
  </div>
);

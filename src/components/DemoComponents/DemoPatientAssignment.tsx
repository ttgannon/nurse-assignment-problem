import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DemoUnitSelection } from "@/components/DemoComponents/DemoUnitSelection";
import { DemoNurseTable } from "@/components/DemoComponents/DemoNurseTable";
import { DemoPatientTable } from "@/components/DemoComponents/DemoPatientTable";
import { AssignmentBoard } from "@/components/AssignmentBoard";
import {
  fetchUnits,
  fetchNurses,
  fetchPatients,
  generateAssignments,
} from "@/hooks/useNursifyApi";
import type {
  NursifyUnit,
  NursifyNurse,
  NursifyPatient,
  NursifyAssignment,
} from "@/types/nursify";

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Select unit" },
  { number: 2, label: "Confirm team" },
  { number: 3, label: "Review patients" },
  { number: 4, label: "Assignment" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-0">
      {STEPS.map(({ number, label }, idx) => {
        const done = number < current;
        const active = number === current;
        return (
          <li key={number} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "border-2 border-primary text-primary"
                    : "border-2 border-muted-foreground/30 text-muted-foreground/50"
                }`}
              >
                {done ? "✓" : number}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`mb-4 h-px w-12 sm:w-20 transition-colors ${
                  done ? "bg-primary" : "bg-muted-foreground/20"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DemoPatientAssignment() {
  const [step, setStep] = useState(1);

  // Data
  const [units, setUnits] = useState<NursifyUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<NursifyUnit | null>(null);
  const [nurses, setNurses] = useState<NursifyNurse[]>([]);
  const [patients, setPatients] = useState<NursifyPatient[]>([]);
  const [assignments, setAssignments] = useState<NursifyAssignment[]>([]);

  // Loading / error states
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load units on mount
  useEffect(() => {
    fetchUnits()
      .then(setUnits)
      .catch(() => setError("Could not load units. Is the server running?"))
      .finally(() => setLoadingUnits(false));
  }, []);

  // Load nurses + patients when a unit is selected
  const handleUnitChange = useCallback(
    async (unitId: number) => {
      const unit = units.find((u) => u.id === unitId) ?? null;
      setSelectedUnit(unit);
      if (!unit) return;

      setLoadingNurses(true);
      setLoadingPatients(true);
      setAssignments([]);
      setStep(2);

      try {
        const [n, p] = await Promise.all([
          fetchNurses(unitId),
          fetchPatients(unitId),
        ]);
        setNurses(n);
        setPatients(p);
        setStep(3);
      } catch {
        setError("Failed to load unit data. Please try again.");
      } finally {
        setLoadingNurses(false);
        setLoadingPatients(false);
      }
    },
    [units]
  );

  // Generate assignments
  async function handleGenerate() {
    if (!selectedUnit || nurses.length === 0 || patients.length === 0) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generateAssignments(patients, nurses);
      setAssignments(result);
      setStep(4);
    } catch {
      setError("Failed to generate assignments. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  // Reset
  function handleReset() {
    setStep(1);
    setSelectedUnit(null);
    setNurses([]);
    setPatients([]);
    setAssignments([]);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Live demo
        </h1>
        <p className="text-muted-foreground">
          Synthetic clinical data · No EHR login required · Assignment generated
          by algorithm
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Step 1 — Unit selection */}
      <Section
        icon={ClipboardList}
        title="Select a unit"
        description="Choose the unit you're charging tonight."
      >
        {loadingUnits ? (
          <Spinner size="sm" />
        ) : (
          <DemoUnitSelection units={units} onChange={handleUnitChange} />
        )}
      </Section>

      {/* Step 2+ — Nurse table */}
      {step >= 2 && selectedUnit && (
        <Section
          icon={Users}
          title="Tonight's nursing team"
          description={`Remove nurses who called out, or add last-minute staff to ${selectedUnit.name}.`}
        >
          {loadingNurses ? (
            <Spinner size="sm" />
          ) : (
            <DemoNurseTable
              nurses={nurses}
              unit={selectedUnit}
              onRemove={(id) =>
                setNurses((prev) => prev.filter((n) => n.id !== id))
              }
              onAdd={(nurse) => setNurses((prev) => [...prev, nurse])}
            />
          )}
        </Section>
      )}

      {/* Step 3+ — Patient table + generate button */}
      {step >= 3 && (
        <Section
          icon={UserCheck}
          title="Patients on unit"
          description="Acuity scores are pre-computed from clinical factors."
        >
          {loadingPatients ? (
            <Spinner size="sm" />
          ) : (
            <>
              <DemoPatientTable patients={patients} />

              {assignments.length === 0 && (
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={generating || nurses.length === 0}
                    className="gap-2"
                  >
                    {generating && <Spinner size="sm" />}
                    {generating ? "Generating…" : "Generate assignment"}
                  </Button>
                  {nurses.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add at least one nurse to generate an assignment.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </Section>
      )}

      {/* Step 4 — Assignment board */}
      {step >= 4 && assignments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Assignment
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? "Regenerating…" : "Regenerate"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Start over
              </Button>
            </div>
          </div>
          <AssignmentBoard assignments={assignments} />
        </div>
      )}
    </div>
  );
}

/**
 * AssignmentBoard — the visual centerpiece of Nursify.
 *
 * Accepts pre-computed NursifyAssignment[] from the backend and renders
 * one card per nurse with their patient list, acuity indicators, and a
 * relative-load bar that makes workload imbalances immediately visible.
 */

import { Pill, Droplets, Monitor, AlertTriangle, Wind, Utensils, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AcuityBadge } from "@/components/AcuityBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NursifyAssignment, NursifyPatient } from "@/types/nursify";
import { cn } from "@/lib/utils";

// ─── ICD-10 → human-readable diagnosis ───────────────────────────────────────

const ICD10_LABELS: Record<string, string> = {
  "A41.9":   "Sepsis, unspecified",
  "C18.9":   "Colon cancer",
  "E11.65":  "Type 2 diabetes w/ hyperglycemia",
  "E11.9":   "Type 2 diabetes mellitus",
  "G35":     "Multiple sclerosis",
  "G43.909": "Migraine, unspecified",
  "G93.1":   "Anoxic brain damage",
  "I10":     "Essential hypertension",
  "I21.4":   "NSTEMI",
  "I21.9":   "Acute MI",
  "I25.10":  "Coronary artery disease",
  "I44.2":   "Complete heart block",
  "I47.1":   "Supraventricular tachycardia",
  "I48.0":   "Paroxysmal atrial fibrillation",
  "I48.2":   "Chronic atrial fibrillation",
  "I48.91":  "Atrial fibrillation, unspecified",
  "I50.33":  "Acute-on-chronic diastolic HF",
  "I50.9":   "Heart failure, unspecified",
  "I63.9":   "Ischemic stroke",
  "I71.2":   "Thoracic aortic aneurysm",
  "J18.1":   "Lobar pneumonia",
  "J18.9":   "Pneumonia, unspecified",
  "J44.1":   "COPD with acute exacerbation",
  "J95.821": "Post-procedural respiratory failure",
  "J96.00":  "Acute respiratory failure",
  "K40.90":  "Inguinal hernia",
  "K57.30":  "Diverticulosis of large intestine",
  "K57.32":  "Diverticulitis of large intestine",
  "K65.0":   "Peritonitis",
  "K72.9":   "Hepatic failure",
  "K92.1":   "Melena (GI bleed)",
  "L97.209": "Chronic lower-leg ulcer",
  "M16.9":   "Hip osteoarthritis",
  "M17.11":  "Right knee osteoarthritis",
  "M32.9":   "Systemic lupus erythematosus",
  "N17.9":   "Acute kidney injury",
  "N18.6":   "End-stage renal disease",
  "N20.0":   "Kidney stone",
  "S72.001A":"Femur fracture",
  "T79.5":   "Traumatic anuria",
  "Z96.641": "Total knee replacement status",
};

function diagnosisLabel(icd10?: string | null): string {
  if (!icd10) return "—";
  return ICD10_LABELS[icd10] ?? icd10;
}

// ─── Deterministic fake room / MRN ────────────────────────────────────────────

function fakeRoom(patientId: string): string {
  const n = Math.abs(parseInt(patientId, 10) || patientId.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  const floor = 3 + (n % 4);           // floors 3–6
  const num   = 10 + (n * 7) % 30;     // rooms 10–39
  const bed   = n % 2 === 0 ? "A" : "B";
  return `${floor}${String(num).padStart(2, "0")}${bed}`;
}

function fakeMrn(patientId: string): string {
  const n = Math.abs(parseInt(patientId, 10) || patientId.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  return `MRN-${String(800000 + (n * 1337) % 199999).padStart(6, "0")}`;
}

// ─── Patient avatar (initials) ────────────────────────────────────────────────

function PatientAvatar({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : name.slice(0, 2);
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {initials.toUpperCase()}
    </div>
  );
}

// ─── Patient tooltip content ──────────────────────────────────────────────────

function PatientTooltipContent({ patient }: { patient: NursifyPatient }) {
  const room = fakeRoom(patient.id);
  const mrn  = fakeMrn(patient.id);
  const diag = diagnosisLabel(patient.icd10);

  return (
    <div className="w-64 space-y-3">
      {/* Header row: avatar + name */}
      <div className="flex items-center gap-3">
        <PatientAvatar name={patient.displayName} />
        <div>
          <p className="font-semibold text-slate-900 leading-tight">{patient.displayName}</p>
          <p className="text-xs text-muted-foreground capitalize">{patient.gender ?? "Unknown"}</p>
        </div>
      </div>

      {/* Key facts grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div>
          <p className="text-muted-foreground">Room</p>
          <p className="font-medium text-slate-900">{room}</p>
        </div>
        <div>
          <p className="text-muted-foreground">MRN</p>
          <p className="font-medium text-slate-900 font-mono">{mrn}</p>
        </div>
        <div className="col-span-2">
          <p className="text-muted-foreground">Diagnosis</p>
          <p className="font-medium text-slate-900">
            {diag}
            {patient.icd10 && diag !== patient.icd10 && (
              <span className="ml-1 font-mono text-muted-foreground">({patient.icd10})</span>
            )}
          </p>
        </div>
      </div>

      {/* Acuity factors */}
      <div className="border-t border-border pt-2">
        <p className="text-xs text-muted-foreground mb-1">Clinical factors</p>
        <div className="flex flex-wrap gap-1">
          {patient.acuityFactors.numMeds > 0 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
              <Pill className="h-3 w-3" />{patient.acuityFactors.numMeds} meds
            </span>
          )}
          {patient.acuityFactors.highRiskMeds > 0 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
              <AlertTriangle className="h-3 w-3" />{patient.acuityFactors.highRiskMeds} high-risk
            </span>
          )}
          {patient.acuityFactors.numDevices > 0 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              <Monitor className="h-3 w-3" />{patient.acuityFactors.numDevices} devices
            </span>
          )}
          {patient.acuityFactors.numDrips > 0 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
              <Droplets className="h-3 w-3" />{patient.acuityFactors.numDrips} drips
            </span>
          )}
          {patient.acuityFactors.newTrach && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
              <Wind className="h-3 w-3" />New trach
            </span>
          )}
          {patient.acuityFactors.tubeFeeds && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              <Utensils className="h-3 w-3" />Tube feeds
            </span>
          )}
          {patient.acuityFactors.woundCare && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-700">
              <Stethoscope className="h-3 w-3" />Wound care
            </span>
          )}
          {!patient.acuityFactors.continent && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              Incontinent
            </span>
          )}
          {!patient.acuityFactors.independentlyMobile && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              Assist w/ mobility
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Workload bar ─────────────────────────────────────────────────────────────

function loadBarColor(pct: number): string {
  if (pct < 0.45) return "bg-emerald-500";
  if (pct < 0.65) return "bg-amber-400";
  if (pct < 0.82) return "bg-orange-500";
  return "bg-red-500";
}

function LoadBar({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = maxScore > 0 ? score / maxScore : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-all duration-500", loadBarColor(pct))}
        style={{ width: `${Math.min(100, pct * 100).toFixed(1)}%` }}
      />
    </div>
  );
}

// ─── Acuity factor icons ──────────────────────────────────────────────────────

function FactorIcons({ patient: p }: { patient: NursifyPatient }) {
  const f = p.acuityFactors;
  const icons: Array<{ show: boolean; Icon: React.ElementType; label: string; color: string }> = [
    { show: f.numDrips > 0,     Icon: Droplets,      label: `${f.numDrips} drip${f.numDrips > 1 ? "s" : ""}`,                   color: "text-blue-500" },
    { show: f.highRiskMeds > 0, Icon: AlertTriangle, label: `${f.highRiskMeds} high-risk med${f.highRiskMeds > 1 ? "s" : ""}`,    color: "text-orange-500" },
    { show: f.numDevices > 0,   Icon: Monitor,       label: `${f.numDevices} device${f.numDevices > 1 ? "s" : ""}`,               color: "text-slate-500" },
    { show: f.numMeds > 0,      Icon: Pill,          label: `${f.numMeds} med${f.numMeds > 1 ? "s" : ""}`,                        color: "text-violet-500" },
    { show: f.newTrach,         Icon: Wind,          label: "New trach",  color: "text-red-500" },
    { show: f.tubeFeeds,        Icon: Utensils,      label: "Tube feeds", color: "text-amber-600" },
    { show: f.woundCare,        Icon: Stethoscope,   label: "Wound care", color: "text-rose-500" },
  ];
  const visible = icons.filter((i) => i.show);
  if (visible.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map(({ Icon, label, color }) => (
        <span key={label} className={cn("inline-flex items-center", color)}>
          <Icon className="h-3 w-3" />
        </span>
      ))}
    </div>
  );
}

// ─── Nurse assignment card ────────────────────────────────────────────────────

function NurseAssignmentCard({ assignment, maxScore }: { assignment: NursifyAssignment; maxScore: number }) {
  const { nurse, patients, assignmentAcuityScore } = assignment;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm leading-tight">{nurse.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {nurse.yearsOfExperience} yr{nurse.yearsOfExperience !== 1 ? "s" : ""} exp
            </p>
          </div>
          <div className="text-right shrink-0">
            <Badge variant="outline" className="text-xs font-mono">
              Score {assignmentAcuityScore}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {patients.length} patient{patients.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <LoadBar score={assignmentAcuityScore} maxScore={maxScore} />
      </CardHeader>

      <CardContent className="flex-1 space-y-2 pt-0">
        {patients.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No patients assigned</p>
        ) : (
          patients.map((patient) => (
            <Tooltip key={patient.id}>
              <TooltipTrigger asChild>
                <div className="flex cursor-default items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/60">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">{patient.displayName}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <FactorIcons patient={patient} />
                    </div>
                  </div>
                  <div className="shrink-0">
                    <AcuityBadge score={patient.acuityScore ?? 0} showScore />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" align="start">
                <PatientTooltipContent patient={patient} />
              </TooltipContent>
            </Tooltip>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// ─── Board summary bar ────────────────────────────────────────────────────────

function BoardSummary({ assignments }: { assignments: NursifyAssignment[] }) {
  const scores = assignments.map((a) => a.assignmentAcuityScore);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  const balanced = max - min <= 16;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
      <div className="flex items-center gap-1.5">
        <span className={cn("h-2 w-2 rounded-full", balanced ? "bg-emerald-500" : "bg-amber-500")} />
        <span className="font-medium">{balanced ? "Well balanced" : "Moderate imbalance"}</span>
      </div>
      <div className="text-muted-foreground">
        Score range: <span className="font-mono font-medium text-foreground">{min}–{max}</span>
      </div>
      <div className="text-muted-foreground">
        Avg: <span className="font-mono font-medium text-foreground">{avg.toFixed(0)}</span>
      </div>
      <div className="text-muted-foreground">
        {assignments.reduce((n, a) => n + a.patients.length, 0)} patients across{" "}
        {assignments.length} nurses
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface AssignmentBoardProps {
  assignments: NursifyAssignment[];
}

export function AssignmentBoard({ assignments }: AssignmentBoardProps) {
  if (assignments.length === 0) return null;

  const maxScore = Math.max(...assignments.map((a) => a.assignmentAcuityScore), 1);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-4">
        <BoardSummary assignments={assignments} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assignments.map((a) => (
            <NurseAssignmentCard key={a.nurse.id} assignment={a} maxScore={maxScore} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

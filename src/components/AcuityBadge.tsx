import { cn } from "@/lib/utils";
import { acuityLevel, type AcuityLevel } from "@/types/nursify";

const levelStyles: Record<AcuityLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  moderate: "bg-amber-50 text-amber-700 border border-amber-200",
  high: "bg-orange-50 text-orange-700 border border-orange-200",
  critical: "bg-red-50 text-red-700 border border-red-200",
};

const levelLabels: Record<AcuityLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

interface AcuityBadgeProps {
  score: number;
  className?: string;
  showScore?: boolean;
}

export function AcuityBadge({ score, className, showScore = false }: AcuityBadgeProps) {
  const level = acuityLevel(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        levelStyles[level],
        className
      )}
    >
      {levelLabels[level]}
      {showScore && <span className="opacity-60">· {score}</span>}
    </span>
  );
}

/** Dot-only variant for tight spaces */
export function AcuityDot({ score, className }: { score: number; className?: string }) {
  const level = acuityLevel(score);
  const dotColors: Record<AcuityLevel, string> = {
    low: "bg-emerald-500",
    moderate: "bg-amber-400",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };
  return (
    <span
      className={cn("inline-block h-2 w-2 rounded-full", dotColors[level], className)}
      title={levelLabels[level]}
    />
  );
}

import { AcuityBadge } from "@/components/AcuityBadge";
import type { NursifyPatient } from "@/types/nursify";

interface DemoPatientTableProps {
  patients: NursifyPatient[];
}

export function DemoPatientTable({ patients }: DemoPatientTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/40">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                Diagnosis
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Acuity</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {p.displayName}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell font-mono text-xs">
                  {p.icd10 ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <AcuityBadge score={p.acuityScore ?? 0} showScore />
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                  No patients found on this unit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

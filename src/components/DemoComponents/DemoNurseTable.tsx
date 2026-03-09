import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { NursifyNurse, NursifyUnit } from "@/types/nursify";
import { addNurse } from "@/hooks/useNursifyApi";

interface DemoNurseTableProps {
  nurses: NursifyNurse[];
  unit: NursifyUnit;
  onRemove: (id: number) => void;
  onAdd: (nurse: NursifyNurse) => void;
}

export function DemoNurseTable({ nurses, unit, onRemove, onAdd }: DemoNurseTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const nurse = await addNurse(name.trim(), Number(yearsExp) || 0, unit.id);
      onAdd(nurse);
      setName("");
      setYearsExp("");
      setDialogOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add nurse.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Experience</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {nurses.map((nurse) => (
              <tr
                key={nurse.id}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-900">{nurse.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">
                    {nurse.yearsOfExperience} yr{nurse.yearsOfExperience !== 1 ? "s" : ""}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(nurse.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove {nurse.name}</span>
                  </Button>
                </td>
              </tr>
            ))}
            {nurses.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                  No nurses on this unit. Add one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Add nurse
        </Button>
      </div>

      {/* Add nurse dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a nurse</DialogTitle>
            <DialogDescription>
              Add a nurse to {unit.name} for this shift.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="nurse-name">Full name</Label>
              <Input
                id="nurse-name"
                placeholder="Jane Smith, RN"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nurse-exp">Years of experience</Label>
              <Input
                id="nurse-exp"
                type="number"
                min={0}
                max={50}
                placeholder="0"
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving}>
              {saving ? "Adding…" : "Add nurse"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

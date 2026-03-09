import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NursifyUnit } from "@/types/nursify";

interface DemoUnitSelectionProps {
  units: NursifyUnit[];
  onChange: (unitId: number) => void;
}

export function DemoUnitSelection({ units, onChange }: DemoUnitSelectionProps) {
  return (
    <Select onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger className="w-full sm:w-72">
        <SelectValue placeholder="Select a unit…" />
      </SelectTrigger>
      <SelectContent>
        {units.map(({ id, name }) => (
          <SelectItem key={id} value={String(id)}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

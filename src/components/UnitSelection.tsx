import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { EpicUnit } from "../interfaces/LoggedInInterface/EpicUnit";
import { Unit } from "../interfaces/Unit";

export const UnitSelection = ({
  units,
  onChange,
}: {
  units: (Unit | EpicUnit)[];
  onChange: (id: number) => void;
}) => {
  return (
    <div className="mb-3">
      <Label htmlFor="unit-selection">Unit</Label>
      <Select onValueChange={(val) => onChange(Number(val))}>
        <SelectTrigger id="unit-selection">
          <SelectValue placeholder="Select your unit" />
        </SelectTrigger>
        <SelectContent>
          {units.map((entry, idx: number) => {
            const id =
              "resource" in entry ? entry.resource.id : String(entry.id);
            const name =
              "resource" in entry ? entry.resource.title : entry.unit_name;
            return (
              <SelectItem key={idx} value={id}>
                {name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

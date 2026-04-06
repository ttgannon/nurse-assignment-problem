import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

export const LoggedInUnitSelection = ({
  onChange,
}: {
  onChange: (id: number) => void;
}) => {
  return (
    <div className="mb-3">
      <Label htmlFor="unit-select">Unit</Label>
      <Select onValueChange={(val) => onChange(Number(val))}>
        <SelectTrigger id="unit-select">
          <SelectValue placeholder="Select a unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Cardiac ICU</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

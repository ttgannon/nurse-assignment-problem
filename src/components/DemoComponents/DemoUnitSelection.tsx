import Form from "react-bootstrap/Form";
import { Unit } from "../../interfaces";

export const DemoUnitSelection = ({
  units,
  onChange,
  required,
  demoSelectedUnit,
}: {
  units: Unit[];
  onChange: (id: number) => void;
  required?: boolean;
  demoSelectedUnit: Unit;
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="disabledTextInput">Unit</Form.Label>
      <Form.Select
        required={required}
        onChange={(e) => {
          onChange(Number(e.currentTarget.value));
        }}
        defaultValue={demoSelectedUnit ? demoSelectedUnit.id : ""}
      >
        <option disabled value="">
          Select a unit
        </option>
        {units.map(({ id, unit_name }) => (
          <option key={id} value={id}>
            {unit_name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

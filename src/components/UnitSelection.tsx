import Form from "react-bootstrap/Form";
import { Unit } from "../interfaces";

export const UnitSelection = ({
  units,
  onChange,
  required,
}: {
  units: Unit[];
  onChange: (id: string) => void;
  required?: boolean;
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="disabledTextInput">Unit</Form.Label>
      <Form.Select
        required={required}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
        defaultValue=""
      >
        <option disabled value="">
          Select a unit
        </option>
        {units.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

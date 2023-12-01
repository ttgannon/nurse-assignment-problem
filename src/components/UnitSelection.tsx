import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";

export const UnitSelection = ({
  units,
  onChange,
  required,
}: {
  units: object;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="disabledTextInput">Unit</Form.Label>
      <Form.Select
        required={required}
        onChange={(e) => {
          onChange(e);
        }}
        defaultValue=""
      >
        <option disabled value="">
          Select your unit
        </option>

        {units.entry.map((entry, idx: number) => (
          <option key={units.entry[idx]} value={units.entry[idx].link[0].url}>
            {units.entry[idx].resource.title}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

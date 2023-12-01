import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import { EpicUnit } from "../interfaces/LoggedInInterface/EpicUnit";

export const UnitSelection = ({
  units,
  onChange,
  required,
}: {
  units: EpicUnit[];
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

        {units.map((entry, idx: number) => (
          <option key={idx} value={entry.fullUrl}>
            {entry.resource.title}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

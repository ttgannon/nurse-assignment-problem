import Form from "react-bootstrap/Form";

export const UnitSelection = ({
  units,
  onChange,
  required,
}: {
  units: object;
  onChange: (id: string) => void;
  required?: boolean;
}) => {
  // console.log(units.entry[0].link[0].url);
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
          Select your unit
        </option>

        {/* {units.entry.map((entry, idx: number) => (
          <option key={units.entry[idx]} value={units.entry[idx].link[0].url}>
            {units.entry[idx].resource.title}
          </option> */}
        {/* ))} */}
      </Form.Select>
    </Form.Group>
  );
};

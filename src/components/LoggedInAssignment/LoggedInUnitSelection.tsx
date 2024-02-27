import Form from "react-bootstrap/Form";

export const LoggedInUnitSelection = ({
  onChange,
}: {
  onChange: (id: number) => void;
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="disabledTextInput">Unit</Form.Label>
      <Form.Select
        onChange={(e) => {
          onChange(Number(e.currentTarget.value));
        }}
      >
        <option disabled value="">
          Select a unit
        </option>
        {
          <option key={1} value={1}>
            {"Cardiac ICU"}
          </option>
        }
      </Form.Select>
    </Form.Group>
  );
};

import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { faker } from "@faker-js/faker";
import { Unit } from "../interfaces";

const getFilteredItems = (query: string, units: Unit[]) => {
  if (!query) {
    return units;
  }
  return units.filter((unit) => unit.name.toLowerCase().startsWith(query));
};

export const UnitForm = ({
  selectedUnit,
  setSelectedUnit,
  handleSubmit,
}: {
  selectedUnit: Unit | null;
  setSelectedUnit: React.Dispatch<React.SetStateAction<Unit>>;
  handleSubmit: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [units] = useState<Unit[]>(() =>
    Array.from({ length: 20 }, () => {
      const unit: Unit = {
        name: faker.lorem.word(),
      };
      return unit;
    }),
  );

  const filtered_items = getFilteredItems(query, units);

  function handleSelection(unit: Unit) {
    setSelectedUnit(unit);
    handleSubmit();
  }

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedUnit === null ? "Select your unit" : selectedUnit}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type your unit"
          onChange={(e) => setQuery(e.target.value)}
        />
        {filtered_items.map((unit) => (
          <Dropdown.Item onClick={() => handleSelection(unit)}>
            {unit.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

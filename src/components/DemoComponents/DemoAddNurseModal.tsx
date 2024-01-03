import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Nurse, Unit } from "../../interfaces";
import { DemoUnitSelection } from "./DemoUnitSelection.tsx";

export const DemoAddNurseModal = ({
  showModal,
  hideModal,
  addNurse,
  units,
  demoSelectedUnit,
  nurses,
}: {
  showModal: boolean;
  hideModal: () => void;
  addNurse: (nurse: Nurse) => void;
  units: Unit[];
  demoSelectedUnit: Unit;
  nurses: Nurse[];
}) => {
  const [nurse, setNurse] = useState<Partial<Nurse>>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    const newNurse: Partial<Nurse> = {
      nurse_name: nurse.nurse_name,
      unit: nurse.unit,
      id: (nurses[nurses.length - 1].id += 2),
    };

    addNurse(newNurse);
    hideModal();
  };

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add Nurse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nurse Name</Form.Label>
            <Form.Control
              required
              defaultValue={nurse?.nurse_name}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setNurse((nurse) => ({ ...nurse, nurse_name: value }));
              }}
            />
          </Form.Group>
          <DemoUnitSelection
            required
            demoSelectedUnit={demoSelectedUnit}
            units={units}
            onChange={(id) => setNurse((nurse) => ({ ...nurse, unit: id }))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
          <Button type="submit">Add</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

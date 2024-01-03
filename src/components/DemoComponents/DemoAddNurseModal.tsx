import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Nurse, Unit } from "../../interfaces";
import { faker } from "@faker-js/faker";
import { DemoUnitSelection } from "./DemoUnitSelection.tsx";

export const DemoAddNurseModal = ({
  showModal,
  hideModal,
  addNurse,
  units,
  demoSelectedUnit,
}: {
  showModal: boolean;
  hideModal: () => void;
  addNurse: (nurse: Nurse) => void;
  units: Unit[];
  demoSelectedUnit: Unit;
}) => {
  const [nurse, setNurse] = useState<Partial<Nurse>>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    if (nurse?.nurse_name && nurse?.unit) {
      const newNurse: Nurse = {
        nurse_name: nurse.nurse_name,
        unit: nurse.unit,
      };

      addNurse(newNurse);
      hideModal();
    }
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
            onChange={(id) =>
              setNurse((nurse) => ({ ...nurse, unit: Number(id) }))
            }
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

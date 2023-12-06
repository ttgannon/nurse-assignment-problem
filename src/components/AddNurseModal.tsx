import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Nurse } from "../interfaces";
import { UnitSelection } from "./UnitSelection.tsx";
import { faker } from "@faker-js/faker";
import { EpicUnit } from "../interfaces/LoggedInInterface/EpicUnit.ts";

export const AddNurseModal = ({
  showModal,
  hideModal,
  addNurse,
  units,
}: {
  showModal: boolean;
  hideModal: () => void;
  addNurse: (nurse: Nurse) => void;
  units: EpicUnit[];
}) => {
  const [nurse, setNurse] = useState<Partial<Nurse>>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    if (nurse?.fullName && nurse?.unitId) {
      const newNurse: Nurse = {
        employeeId: faker.number.int(),
        fullName: nurse.fullName,
        unitId: nurse.unitId,
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
              defaultValue={nurse?.fullName}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setNurse((nurse) => ({ ...nurse, fullName: value }));
              }}
            />
          </Form.Group>
          <UnitSelection
            required
            units={units}
            onChange={(id) =>
              setNurse((nurse) => ({ ...nurse, unitId: Number(id) }))
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

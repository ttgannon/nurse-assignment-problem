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
    /* 
    
    Need to create a random ID for each additional nurse to render on the page; this lets React keep track of each element for removal. The below code achieves this.
    
    */
    const nurseIds = nurses.map((nurse) => {
      return nurse.id;
    });

    let randInt = 0;
    while (randInt in nurseIds) {
      randInt = Math.floor(Math.random() * 1000);
    }

    /* The below code creates a new instance of Nurse taking the name and unit fields, plus the random unique ID generated, and returns it to the Nurse Table. */

    const newNurse: Partial<Nurse> = {
      nurse_name: nurse?.nurse_name,
      unit: nurse?.unit,
      id: randInt + nurse?.nurse_name,
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
            onChange={(id) =>
              setNurse((nurse) => ({
                ...nurse,
                unit: id,
              }))
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

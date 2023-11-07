import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export const NewNurseForm = ({
  showModal,
  setShowModal,
  addNewNurse,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  addNewNurse: (nurse: { nurseName: string; nurseUnit: string }) => void;
}) => {
  const [fullName, setFullName] = useState("");
  const [nurseUnit, setNurseUnit] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNurseUnit(e.target.value);
  };

  const formData = {
    nurseName: fullName,
    nurseUnit,
  };

  return (
    <div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Another Nurse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Getting a float nurse or overtime? Enter their info here.
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nurse Name</Form.Label>
              <Form.Control
                placeholder="Required"
                value={fullName}
                onChange={handleNameChange}
              ></Form.Control>
              <Form.Text className="text-muted">
                You can enter their unit name if you aren't sure who it will be
                yet.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nurse Unit</Form.Label>
              <Form.Control
                placeholder="Optional"
                value={nurseUnit}
                onChange={handleUnitChange}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => addNewNurse(formData)}>
            Add this nurse
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

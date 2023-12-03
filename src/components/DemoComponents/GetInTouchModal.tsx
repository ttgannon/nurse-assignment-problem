import { Button, Form, Modal } from "react-bootstrap";

export const GetInTouchModal = ({
  showModal,
  hideModal,
}: {
  showModal: boolean;
  hideModal: () => void;
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    console.log(`submitted form`);
    hideModal();
  };

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Get in touch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Your name</Form.Label>
            <Form.Control
              required
              onChange={(e) => {
                const value = e.currentTarget.value;
              }}
            />
            <Form.Label>Your email</Form.Label>
            <Form.Control
              required
              onChange={(e) => {
                const value = e.currentTarget.value;
              }}
            />
            <Form.Label>Your inquiry</Form.Label>
            <Form.Control
              required
              onChange={(e) => {
                const value = e.currentTarget.value;
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
          <Button
            type="submit"
            onClick={() => {
              handleSubmit;
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiry: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      inquiry: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <Row>
      <Col md={4} className="justify-content-center mx-auto">
        <div className="px-5 mx-5 my-3 py-3 mx-auto">
          <h1>Let us know what you think.</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your name</Form.Label>
              <Form.Control
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Form.Label className="mt-3">Your email</Form.Label>
              <Form.Control
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              <Form.Label className="mt-3">Your inquiry</Form.Label>
              <textarea
                className="form-control"
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                rows={3}
              ></textarea>
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
          {submitted && (
            <Modal show={submitted} onHide={handleClose}>
              <Modal.Dialog className="m-0 p-3">
                <Modal.Header closeButton>
                  <Modal.Title>Thanks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>We got your message.</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal>
          )}
        </div>
      </Col>
    </Row>
  );
};

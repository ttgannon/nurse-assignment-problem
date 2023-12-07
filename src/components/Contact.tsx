import { Button, Col, Form, Row } from "react-bootstrap";

export const Contact = () => {
  return (
    <Row>
      <Col md={4} className="justify-content-center mx-auto">
        <div className="px-5 mx-5 my-3 py-3 mx-auto">
          <h1>Let us know what you think.</h1>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Your name</Form.Label>
              <Form.Control required />
              <Form.Label className="mt-3">Your email</Form.Label>
              <Form.Control required type="email" />
              <Form.Label className="mt-3">Your inquiry</Form.Label>
              <textarea className="form-control" rows={3}></textarea>
            </Form.Group>

            <Button type="submit">Submit</Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

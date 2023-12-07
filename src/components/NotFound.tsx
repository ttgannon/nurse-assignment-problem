import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Row>
        <Col md={6} className="justify-content-center mx-auto my-5">
          <div className="bg-light p-5">
            <h1>Sorry, we couldn't find what you're looking for.</h1>
            <Button onClick={() => navigate("/")}>Go home</Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

import { Col, Row } from "react-bootstrap";

export const Background = () => {
  return (
    <>
      <Row>
        <Col md={5} className="mx-auto">
          <div>
            <h1>Nurses deserve safe patient assignments.</h1>
          </div>

          <h2>
            Making the nurse-patient assignment in the hospital is hard. Charge
            nurses must make tough choices about how to allocate health
            resources. Now, with Nursify, Charge Nurses can breathe easy.
          </h2>
          <h2>
            What used to take hours and require years of experience now takes
            seconds.
          </h2>
        </Col>
      </Row>
    </>
  );
};

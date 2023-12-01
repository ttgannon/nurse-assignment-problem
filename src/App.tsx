import { useRef } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Auth } from "./components";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import "./assets/styles/homepage.css";

import { DemoPatientAssignment } from "./components/DemoPatientAssignment";

const App = () => {
  const ref = useRef(null);

  return (
    <>
      <Container fluid className="homePage">
        <Row>
          <Col
            md={5}
            style={{
              backgroundColor: "rgb(145, 44, 240)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1 className="nursifyLogo">Nursify</h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="src/assets/doctor-surgeon-icon.svg"
                style={{
                  maxWidth: "400px",

                  marginTop: "50px",
                }}
                alt="Doctor Surgeon Icon"
              />
            </div>
            <h1
              style={{
                textAlign: "center",
                fontSize: 90 + "px",
                marginTop: 50 + "%",
                marginBottom: 50 + "%",
                maxWidth: "fit-content",
                color: "black",
              }}
            >
              Nurses deserve safe patient assignments.
            </h1>
          </Col>
          <Col className="align-items-center justify-content-center">
            <div
              className="align-items-center text-align-center"
              style={{
                marginTop: 25 + "%",
                flexDirection: "column",
                display: "flex",
              }}
            >
              <h1 style={{ fontSize: 70 + "px", textAlign: "center" }}>
                Welcome to Nursify.
              </h1>
              <Alert
                className="d-flex"
                variant="info"
                style={{
                  textAlign: "center",
                  maxWidth: 40 + "vw",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Alert.Heading style={{ fontSize: 20 + "px" }}>
                  Making safer, fairer patient assignments with the power of
                  machine learning.
                </Alert.Heading>
                <p className="mb-0"></p>
              </Alert>
              <Row className="justify-content-center align-items-center d-flex">
                <Col className="d-flex justify-content-center align-items-center">
                  <Auth />
                  <Form>
                    <Button
                      onClick={() => {
                        if (ref.current)
                          (ref.current as HTMLDivElement).scrollIntoView();
                      }}
                      variant="outline-secondary"
                    >
                      Try a demo
                    </Button>
                  </Form>
                </Col>
              </Row>
              <div
                style={{
                  marginTop: 125 + "px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="src/assets/hospital-building-color-icon.svg"
                  alt="Hospital Icon"
                  width="150px"
                />
              </div>
              <Card
                style={{
                  width: 700 + "px",

                  marginTop: 20 + "%",
                  marginBottom: 30 + "%",
                  fontSize: 20 + "px",
                }}
                text="black"
                key="success"
                bg="light"
              >
                <Card.Header>
                  <strong>How does it work?</strong>
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    We've trained our digital Charge Nurse on millions of
                    nurse-patient assignments. Cally looks at your floor's
                    patients and makes a safe, fair nurse-patient assignment at
                    the click of a button, saving you time and making your
                    nurses happier.
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <h1 style={{ marginBottom: 1 + "%", marginTop: 40 + "px" }}>
              Go ahead. Check it out.
            </h1>
            <div ref={ref}>
              <DemoPatientAssignment />
            </div>
          </Col>
        </Row>
      </Container>

      <Container fluid className="loginContainer">
        <Row>
          <Col>
            <h5>Pricing</h5>
          </Col>
          <Col>
            <h5>Terms</h5>
          </Col>
          <Col>
            <h5>Contact</h5>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;

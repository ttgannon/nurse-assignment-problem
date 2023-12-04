import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Auth } from "./components";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import "./assets/styles/homepage.css";

import { DemoPatientAssignment } from "./components/DemoComponents/DemoPatientAssignment";
import { useNavigate } from "react-router-dom";

const App = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const [demoAssignmentRendered, setDemoAssignmentRendered] = useState(false);

  const handleDemoAssignment = () => {
    setDemoAssignmentRendered(true);
  };

  useEffect(() => {
    if (localStorage.getItem("epic-access-token")) navigate("/assignment");
  }, [navigate]);

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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="src/assets/balloon-heart-fill.svg"
                style={{
                  width: "40%",
                  marginBottom: "30%",
                }}
                alt="Balloon Heart Icon"
              />
            </div>
            {demoAssignmentRendered && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="src/assets/bandaid.svg"
                    style={{
                      width: "30%",
                      marginBottom: "70%",
                      marginTop: "50px",
                    }}
                    alt="Bandaid Icon"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="src/assets/capsule-pill.svg"
                    style={{
                      width: "30%",
                      marginBottom: "100%",
                      marginTop: "50px",
                    }}
                    alt="Pill Icon"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="src/assets/heart-pulse.svg"
                    style={{
                      width: "30%",
                      marginBottom: "40%",
                      marginTop: "200px",
                    }}
                    alt="Heart Pulse Icon"
                  />
                </div>
              </>
            )}
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
                  marginTop: 200 + "px",
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
                    Our digital Charge Nurse looks at your floor's patients and
                    makes a safe, fair nurse-patient assignment at the click of
                    a button, saving you time and making your nurses happier.
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <h1 style={{ marginBottom: 1 + "%", marginTop: 40 + "px" }}>
              Go ahead. Check it out.
            </h1>
            <div ref={ref}>
              <DemoPatientAssignment demoAssignment={handleDemoAssignment} />
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

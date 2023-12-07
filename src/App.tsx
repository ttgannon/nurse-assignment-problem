import { useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import "./assets/styles/homepage.css";
import { useNavigate } from "react-router-dom";
import { Auth } from "./components";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("epic-access-token")) navigate("/assignment");
  }, [navigate]);

  return (
    <>
      <main>
        <div
          className="p-md-5 text-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom left, #ffffff, rgb(145, 44, 240))",
          }}
        >
          <div className="p-lg-5 mx-auto my-5">
            <h1 className="display-4 fw-normal">Welcome to Nursify</h1>
            <p className="lead fw-normal">
              Making safer, fairer patient assignments with the power of machine
              learning.
            </p>
            <div className="d-flex justify-content-center">
              <Auth />
              <Button className="btn btn-secondary ms-1" href="/demo">
                See a demo
              </Button>
            </div>
          </div>
        </div>

        <Row className="px-5 mx-5">
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
            <Col md={8} className="bg-light">
              <div className="me-md-3 pt-3 mt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                <div className="my-3 p-3">
                  <h2 className="display-5">
                    Nurses deserve safe patient assignments.
                  </h2>
                </div>
              </div>
            </Col>
            <Col md={4} className="bg-dark">
              <div className="me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white">
                <div className="my-3 p-3">
                  <img
                    src="src/assets/heart-pulse.svg"
                    style={{
                      width: "150px",
                    }}
                    alt="Heart Icon"
                  />
                </div>
              </div>
            </Col>
          </div>
        </Row>

        <Row className="px-5 mx-5">
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ">
            <Col md={4} className="bg-dark">
              <div className="me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white">
                <div className="my-3 p-3">
                  <img
                    src="src/assets/hospital-building-color-icon.svg"
                    alt="Hospital Icon"
                    width="150px"
                  />
                </div>
              </div>
            </Col>
            <Col md={8} className="bg-light">
              <div className="me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                <div className="m-5 p-3">
                  <h2 className="display-5">How does it work?</h2>
                  <p className="lead">
                    Our digital Charge Nurse looks at your floor's patients and
                    makes a safe, fair nurse-patient assignment at the click of
                    a button, saving you time and making your nurses happier.
                  </p>
                </div>
              </div>
            </Col>
          </div>
        </Row>

        <Row className="px-5 mx-5">
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
            <Col md={8} className="bg-light">
              <div className="m-5 p-3 d-flex justify-content-center">
                <div>
                  <h1>Try it out</h1>
                  <div className="d-flex ">
                    <Button
                      className="justify-content-center d-flex me-1"
                      onClick={() => navigate("/demo")}
                    >
                      Take me to the demo
                    </Button>
                    <Auth />
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4} className="bg-dark">
              <div className="me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white">
                <div className="my-3 p-3">
                  <img
                    src="src/assets/doctor-surgeon-icon.svg"
                    style={{
                      width: "150px",
                    }}
                    alt="Nurse Icon"
                  />
                </div>
              </div>
            </Col>
          </div>
        </Row>
      </main>
    </>
  );
};

export default App;

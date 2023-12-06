import { useEffect } from "react";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import "./assets/styles/homepage.css";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("epic-access-token")) navigate("/assignment");
  }, [navigate]);

  return (
    <>
      <main>
        <div
          className="p-3 p-md-5 m-md-3 text-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom left, #ffffff, rgb(145, 44, 240))",
          }}
        >
          <div className="p-lg-5 mx-auto my-5">
            <h1 className="display-4 fw-normal">Welcome to Nursfiy</h1>
            <p className="lead fw-normal">
              Making safer, fairer patient assignments with the power of machine
              learning.
            </p>
            <a className="btn btn-outline-secondary" href="#">
              See a demo
            </a>
          </div>
        </div>

        <Row>
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
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
                <div className="my-3 p-3">
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
        <Row>
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
            <Col md={8} className="bg-light">
              <div className="me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
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
                    src="src/assets/balloon-heart-fill.svg"
                    style={{
                      width: "150px",
                    }}
                    alt="Balloon Heart Icon"
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

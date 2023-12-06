import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoggedInAssignment } from "./components/LoggedInAssignment/LoggedInAssignment.tsx";
import { DemoPatientAssignment } from "./components/DemoComponents/DemoPatientAssignment.tsx";
import { Container, Nav, Navbar, Row } from "react-bootstrap";
import { Contact } from "./components/index.ts";

export const Context = createContext(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/assignment",
    element: <LoggedInAssignment />,
  },
  {
    path: "/demo",
    element: <DemoPatientAssignment />,
  },
  { path: "/contact", element: <Contact /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Navbar
      expand="lg"
      className="bg-body-tertiary justify-content-between"
      data-bs-theme="dark"
    >
      <Container className="d-flex flex-column flex-md-row">
        <Navbar.Brand href="/" className="justify-content-left ">
          <img
            src="src/assets/flower1.svg"
            className="d-inline-block align-top"
            style={{ width: 30 }}
          />{" "}
          Nursify
        </Navbar.Brand>
        <Nav className="justify-content-center">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/demo">Demo</Nav.Link>
          <Nav.Link href="/contact">Contact</Nav.Link>
          <Nav.Link href="/demo">Background</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    <RouterProvider router={router} />
    <footer className="container py-5">
      <Row>
        <div className="col-12 col-md">
          <img src="src/assets/flower1.svg" style={{ width: 20 }}></img> Nursify
          <small className="d-block mb-3 text-body-secondary">© 2023</small>
        </div>
        <div className="col-6 col-md">
          <h5>Features</h5>
          <ul className="list-unstyled text-small">
            <li className="link-secondary text-decoration-none">
              Customizable
            </li>
            <li className="link-secondary text-decoration-none">
              Connects with EPIC API
            </li>
            <li className="link-secondary text-decoration-none">
              Almost instant
            </li>
            <li className="link-secondary text-decoration-none">
              Fully-featured
            </li>
            <li className="link-secondary text-decoration-none">
              On-demand service
            </li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Resources</h5>
          <ul className="list-unstyled text-small">
            <li className="link-secondary text-decoration-none">How to use</li>
            <li className="link-secondary text-decoration-none">
              Suggest a bug fix
            </li>
            <li className="link-secondary text-decoration-none">
              Contribute to the project
            </li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>About</h5>
          <ul className="list-unstyled text-small">
            <li className="link-secondary text-decoration-none">Why Nursify</li>
            <li className="link-secondary text-decoration-none">
              Connect on LinkedIn
            </li>
            <li className="link-secondary text-decoration-none">
              Meet the team
            </li>
            <li className="link-secondary text-decoration-none">Policy</li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Invest in Nursify</h5>
          <ul className="list-unstyled text-small">
            <a href="/contact" className="link-secondary text-decoration-none">
              Get in touch
            </a>
          </ul>
        </div>
      </Row>
    </footer>
  </React.StrictMode>,
);

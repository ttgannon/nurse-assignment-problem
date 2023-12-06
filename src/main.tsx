import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoggedInAssignment } from "./components/LoggedInAssignment/LoggedInAssignment.tsx";
import { DemoPatientAssignment } from "./components/DemoComponents/DemoPatientAssignment.tsx";
import { Container, Nav, Navbar } from "react-bootstrap";

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
          <Nav.Link href="/demo">Contact</Nav.Link>
          <Nav.Link href="/demo">Background</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

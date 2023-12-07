import { useState } from "react";
import { Container, Nav, Navbar, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("epic-access-token") ? true : false,
  );

  return (
    <>
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
            <Nav.Link href="/background">Background</Nav.Link>
            {loggedIn && (
              <Nav.Link
                onClick={() => {
                  localStorage.removeItem("epic-access-token");
                }}
                href="/"
              >
                Log out
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Outlet context={[loggedIn, setLoggedIn]} />
      <footer className="container py-5">
        <Row>
          <div className="col-12 col-md">
            <img src="src/assets/flower1.svg" style={{ width: 20 }}></img>{" "}
            Nursify
            <small className="d-block mb-3 text-body-secondary">© 2023</small>
          </div>
        </Row>
      </footer>
    </>
  );
};

export default App;

import React from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';

const NavbarComponent = () => {
  return (
    <Navbar variant="dark" expand="lg" style={{ width: '100%' }}>
      <Container
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          // border: "1px solid black",
        }}
      >
        <Navbar.Brand href="/" className="nav-title">
          <strong>[3124510076] - Hesa Firdaus </strong>{' '}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-custom-collapse">
          <Nav className="">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

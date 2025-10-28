"use client";
import React from 'react';
import Link from 'next/link';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';

export default function NavbarClient() {
  return (
    <Navbar variant="dark" expand="lg" style={{ width: '100%' }}>
      <Container
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Navbar.Brand as={Link} href="/" className="nav-title">
          <strong>[3124510076] - Hesa Firdaus </strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-custom-collapse">
          <Nav className="">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
            <Nav.Link as={Link} href="/">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

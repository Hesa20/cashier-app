"use client";
import React from 'react';
import Link from 'next/link';
import { Navbar, Container } from 'react-bootstrap';
import AccountInfo from './AccountInfo';

export default function NavbarClient() {
  return (
    <Navbar variant="dark" expand="lg" style={{ width: '100%' }}>
      <Container
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Navbar.Brand as={Link} href="/" className="nav-title">
          <strong>Cashier-App created by [Hesa Firdaus - 3124510076]</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <AccountInfo />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

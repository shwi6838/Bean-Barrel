import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

const NavBar = () => { // Use arrow functions to define components so we can pass hooks and props if needed
  return (
    <Navbar sticky="top" expand="lg" className="c-navbar">
      <Container className="c-navbar">
        <Navbar.Brand as={Link} to="/" className="c-nav-link">Bean & Barrel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="c-nav-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/map" className="c-nav-link">Map</Nav.Link>
            <Nav.Link as={Link} to="/list" className="c-nav-link">List</Nav.Link>
            <Nav.Link as={Link} to="/profile" className="c-nav-link">Profile</Nav.Link>
            {/* <Nav.Link as={Link} to="/login" id="nav-link">Login</Nav.Link> */}
          </Nav>
            <Button as={Link} to="/login" className="ml-2 nav-button">Login</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar


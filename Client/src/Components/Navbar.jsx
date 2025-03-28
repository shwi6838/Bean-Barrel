import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

const NavBar = () => { // Use arrow functions to define components so we can pass hooks and props if needed
  return (
    <Navbar fixed="top" expand="lg" className="custom-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/" className="c-nav-brand">Bean & Barrel</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto w-100 d-flex justify-content-center align-items-center">
            <Nav.Link as={Link} to="/" className="c-nav-link">Home</Nav.Link>
            <NavDropdown title="Discover" id="basic-nav-dropdown" className="c-nav-link">
              <NavDropdown.Item as={Link} to="/map" className="c-nav-link">Map</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/list" className="c-nav-link">List</NavDropdown.Item> 
            </NavDropdown>
            <Nav.Link as={Link} to="/profile" className="c-nav-link">Profile</Nav.Link>
          </Nav>
            <Button as={Link} to="/login" className="ml-2 nav-button">Login</Button>
            <Button as={Link} to="/register" className="ml-2 nav-button">Register</Button>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavBar


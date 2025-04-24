import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";


const NavBar = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("http://localhost:3080/auth/api/users", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setSession(data.users?.[0] || null);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3080/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        console.log("Logged out successfully");
        setSession(null); // Optional: clear session immediately
        navigate("/map");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Navbar fixed="top" expand="lg" className="custom-navbar">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/" className="c-nav-brand">Bean & Barrel</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto w-100 d-flex justify-content-center align-items-center">
            <Nav.Link as={Link} to="/" className="c-nav-link">Home</Nav.Link>
            <NavDropdown title="Discover" id="discover-dropdown" className="c-nav-link">
              <NavDropdown.Item as={Link} to="/map" className="c-nav-link">Map</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/list" className="c-nav-link">List</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/profile" className="c-nav-link">Profile</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <span className="me-2">Hello, {session?.name || "Guest"}</span>
            {session ? (
              <Button onClick={handleLogout} className="ml-2 nav-button">Logout</Button>
            ) : (
              <>
                <Button as={Link} to="/login" className="ml-2 nav-button">Login</Button>
                <Button as={Link} to="/register" className="ml-2 nav-button">Register</Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

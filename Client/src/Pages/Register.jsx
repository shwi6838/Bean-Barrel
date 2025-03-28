import React from "react";
import { useState } from "react";
import { Container, Button, ButtonGroup, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    return (
        <div className="register-page">
          <div className="login-card">
          <h2>Grab a Seat!</h2>
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
          <form className="mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <br />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <button type="submit">Register an Account</button>
          </form>
          <p>Have an account? <Link to="/login" className="register-link">Login</Link></p>
        </div>
        </div>
      );
}

export default RegisterPage;


import React from "react";
import { useState } from "react";
import { Container, Button, ButtonGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom"; 

function RegisterPage() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate()
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
  
      try {
        const response = await fetch("http://localhost:3080/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({name, phone, username, password }),
        });
  
        const data = await response.json();
        console.log("Response:", data);
  
        if (data.success) {
          // navigate specific url
          navigate("/login");
        } else {
          setError( "User Already Exists. Please try again.");
        }
  
        // clean input boxs after username and password entered
        setName("");
        setPhone("")
        setUsername("");
        setPassword("");

      } catch (error) {
        console.error("Error submitting login:", error);
        setError("Something went wrong. Please try again later.");
      }
    };

    return (
        <div className="register-page">
          <div className="login-card">
          <h2>Grab a Seat!</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit} className=" mb-3">
            <div className="register-form">
            <div>
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />
            <label htmlFor="Phone">Phone</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <br />
            </div>
            <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Email"
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
            </div>
            </div>
            <button type="submit">Register an Account</button>
          </form>
          <p>Have an account? <Link to="/login" className="register-link">Login</Link></p>
        </div>
        </div>
      );
}

export default RegisterPage;


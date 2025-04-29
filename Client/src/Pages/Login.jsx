import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom"; 

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); //Using Frontend pages navigate

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3080/auth/logout", {
  //       method: "POST",
  //       credentials: 'include',
  //       headers: {
  //         "Content-Type": "application/json",
  //       }
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       console.log("Logged out successfully");
  //       window.location.href = '/';;
  //     }
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.success) {
        // navigate specific url
        window.location.href = '/';
      } else {
        setError(data.error || "Login failed. Please try again.");
      }

      // clean input boxs after username and password entered
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Error submitting login:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
      <h2>Welcome Back!</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="mb-3">
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
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register" className="register-link">Register</Link></p>
    </div>
    </div>
  );
}

export default LoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 确保你的项目使用了 React Router

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 用于前端页面跳转

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3080/auth/logout", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();
      if (data.success) {
        console.log("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // 清除之前的错误

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
        // 跳转到后端返回的 URL
        navigate("/");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }

      // 清除输入框
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Error submitting login:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
        <button 
          onClick={handleLogout} 
          style={{ 
            backgroundColor: 'red', 
            color: 'white'
          }}
        >
          Logout
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

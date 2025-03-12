import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState([])

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:3080/api/users");
      console.log(response.data.users);
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
     {/* Test for users test api */}
      <div>
        <h2>Users Test</h2>
        {/* display the users here */}
        {users.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
          </div>
        ))}
      </div>
      
      {/* Add Header, NavBar, Footer, and Routes here */}
      <Header />
      < Router >
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes */}
        </Routes>
      </Router>

      <Footer />
    </>
  )
}

export default App

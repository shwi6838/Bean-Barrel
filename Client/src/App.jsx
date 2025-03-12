import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:3080/api/users");
      console.log(response.data.users);
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <div>
        {/* display the users here */}
        {users.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
          </div>
        ))}
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

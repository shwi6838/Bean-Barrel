import React, { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
    const [users, setUsers] = useState([]);
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
        <div>
        <h1>Landing Page</h1>
        <p>Welcome to the Home Page</p>
        <div>
            <h2>Users API Test</h2>
            {/* display the users here */}
                {users.map((user) => (
                    <div key={user.id}>
                        <h3>{user.name}</h3>
                    </div>
                ))}
        </div>
        </div>
    );
}

export default HomePage
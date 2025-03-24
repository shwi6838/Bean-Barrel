import React, { useState, useEffect } from "react";
import axios from "axios";

function HomePage(jsonform) {
    const [users, setUsers] = useState([]);
    const fetchAPI = async () => {
        try {
          const response = await axios.get("http://localhost:3080/api/users", {
            withCredentials: true
          });
          console.log("API Response:", response.data);
          console.log("Users data:", response.data.users);
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
            {users && users.map((user) => {
                console.log("Processing user:", user);
                return (
                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '10px 0' }}>
                        <h3>Username: {user.name}</h3>
                        <h3>Favorite List : {user.favlist}</h3>
                    </div>
                );
            })}
        </div>
        </div>
    );
}

export default HomePage
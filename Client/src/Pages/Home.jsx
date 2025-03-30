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
        <h1>Welcome to the Home Page</h1>
        <div>
            {users && users.map((user) => {
                console.log("Processing user:", user);
                return (
                  <h3>Username: {user.name}</h3>
                );
            })}
        </div>
        </div>
    );
}

export default HomePage
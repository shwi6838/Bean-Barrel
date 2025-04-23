
import React, { useState,useEffect} from 'react';
import { Container, Button, ButtonGroup, Card } from 'react-bootstrap';
import axios from "axios";

function ProfilePage() {
    const [testProfile, setTestProfile] = useState({
        name: "",
        email: "",
        phone: "",
        favlist: []
    });
    const [activeTab, setActiveTab] = useState("account");
    const fetchAPI = async () => {
        try {
          const response = await axios.get("http://localhost:3080/auth/api/users", {
            withCredentials: true
          });
          
          const name = response.data.users[0]['name']
          const email = response.data.users[0]['username']
          const phone = response.data.users[0]['phone']
          const favlist_name = response.data.users[0]['favlist_name']
          setTestProfile({name, email, phone, favlist_name})
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }

    useEffect(() => {
      fetchAPI();
    }, []);

    return (
        <Container fluid>
            <h1>Profile Page</h1>
            <div className="mt-5 mb-4">
                <ButtonGroup>
                    <Button className="nav-button" onClick={() => setActiveTab("account")}>Account Information</Button>
                    <Button className="nav-button" onClick={() => setActiveTab("favorites")}>Favorite Stores</Button>
                </ButtonGroup>
            </div>

            {activeTab === "account" && (
                <Card>
                    <Card.Body>
                        <Card.Title>Account Information</Card.Title>
                        <Card.Text>
                            <p>Name: {testProfile.name}</p>
                            <p>Email: {testProfile.email}</p>
                            <p>Phone: {testProfile.phone}</p>
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}

            {activeTab === "favorites" && (
                <Card>
                    <Card.Body>
                        <Card.Title>Favorite Stores</Card.Title>
                            <Card.Text>
                                {testProfile.favlist_name && testProfile.favlist_name.length > 0 && (
                                    testProfile.favlist_name.map((id, index) => (
                                    <p key={index}>{id}</p>
                                    ))
                                )}
                            </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default ProfilePage
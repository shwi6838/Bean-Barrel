
import React, { useState } from 'react';
import { Container, Button, ButtonGroup, Card } from 'react-bootstrap';


function ProfilePage() {
    const [testProfile, setTestProfile] = useState({
        name: "John Doe",
        email: "example@gmail.com",
        phone: "123-456-7890",
    });
    const [activeTab, setActiveTab] = useState("account");

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
                            <p>Cafe 1</p>
                            <p>Cafe 2</p>
                            <p>Bar 1</p>
                        </Card.Text>
                    </Card.Body>
                </Card> 
            )}
        </Container>
    );
}

export default ProfilePage
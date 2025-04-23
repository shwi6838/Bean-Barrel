
import React, { useState,useEffect} from 'react';
import { Container, Button, ButtonGroup, Card, Modal } from 'react-bootstrap';
import axios from "axios";

function ProfilePage() {
    const [testProfile, setTestProfile] = useState({
        name: "Guest",
        email: "N/A",
        phone: "N/A",
        favlist_name: [],
    });
    const [activeTab, setActiveTab] = useState("account");

    const [showModal, setShowModal] = useState(false);
    const [editedProfile, setEditedProfile] = useState(testProfile);

    const handleEditClick = () => {
        setEditedProfile(testProfile); // Initialize modal fields with current profile data
        setShowModal(true);
      };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile((prev) => ({ ...prev, [name]: value }));
      };
    
    const handleSave = async () => {
        try {
          const response = await fetch("/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedProfile),
          });
    
          if (!response.ok) {
            throw new Error(`Failed to update profile: ${response.statusText}`);
          }
    
        const data = await response.json();
        const name = data.users[0]['name']
        const email = data.users[0]['username']
        const phone = data.users[0]['phone']
        const favlist_name = data.users[0]['favlist_name']
        setTestProfile({name, email, phone, favlist_name})
          setShowModal(false);
          alert("Profile updated successfully!");
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("Failed to update profile. Please try again.");
        }
      };

    const fetchUser = async () => {
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
      fetchUser();
    }, []);

    return (
        <Container fluid className="profile-page">
            <div className="mt-3 mb-3">
                <ButtonGroup>
                    <Button className="nav-button" onClick={() => setActiveTab("account")}>Account Information</Button>
                    <Button className="nav-button" onClick={() => setActiveTab("favorites")}>Favorite Stores</Button>
                </ButtonGroup>
            </div>

            {activeTab === "account" && (
                <Card className="account-card">
                    <Card.Body>
                        <Card.Title>Account Information</Card.Title>
                        <Card.Text>
                            <p>Name: {testProfile.name}</p>
                            <p>Email: {testProfile.email}</p>
                            <p>Phone: {testProfile.phone}</p>
                        </Card.Text>
                    </Card.Body>
                    <Button variant="primary" onClick={handleEditClick}>Edit Account</Button>
                </Card>
            )}

            {activeTab === "favorites" && (
                <Card className="favorites-card">
                    <Card.Body>
                        <Card.Title>Favorite Stores</Card.Title>
                            <Card.Text>
                                {testProfile.favlist_name && testProfile.favlist_name.length > 0 ? (
                                    testProfile.favlist_name.map((id, index) => (
                                    <p key={index}>{id}</p>
                                    ))
                                ) : (
                                    <p>No favorite stores found.</p>
                                )}
                            </Card.Text>
                    </Card.Body>
                </Card>
            )}

            {/*Modal for editedProfile */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" name="name" value={editedProfile.name} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" name="email" value={editedProfile.email} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <input type="text" className="form-control" id="phone" name="phone" value={editedProfile.phone} onChange={handleChange} />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
        </Container>
    );
}

export default ProfilePage
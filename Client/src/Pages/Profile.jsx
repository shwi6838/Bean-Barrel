
import React, { useState,useEffect} from 'react';
import { Container, Button, ButtonGroup, Card, Modal } from 'react-bootstrap';
import axios from "axios";
import "../Profile.css";

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
          const response = await fetch("http://localhost:3080/auth/update", {
            method: "POST",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedProfile),
          });
    
          const data = await response.json();
          if (!data) {
            throw new Error(`Failed to update profile: ${response.statusText}`);
          }
          console.info(data['name'])
          const name = data['name']
          const email = data['username']
          const phone = data['phone']
          const favlist_name = data['favlist_name']
          setTestProfile({name, email, phone, favlist_name})
          setShowModal(false);
          alert("Profile updated successfully!");
          window.location.reload();
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

    const handleFavoriteDelete = async (id) => {
      console.log("Deleting favorite store with ID:", id);
      try {
        const response = await fetch(`http://localhost:3080/list/delete`, {
          method: "DELETE",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
    
        if (!response.ok) {
          alert('Failed to delete favorite store');
        }
    
        alert("Favorite store deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting favorite store:", error);
        alert("Failed to delete favorite store. Please try again.");
      }
    };

    useEffect(() => {
      fetchUser();
    }, []);

    return (
        <>
        
        <Container fluid className="profile-page">
            <div className="account-tabs mb-3">
                <ButtonGroup>
                    <Button className="profile-tab" onClick={() => setActiveTab("account")}>Account Information</Button>
                    <Button className="profile-tab" onClick={() => setActiveTab("favorites")}>Favorite Stores</Button>
                </ButtonGroup>
            </div>

            {activeTab === "account" && (
                <Card className="account-card">
                    <Card.Body>
                        <Card.Title><h1>Account Information</h1></Card.Title>
                        <Card.Text className="account-info">
                            <p className="Name">{testProfile.name}</p>
                            <p>Email: {testProfile.email}</p>
                            <p>Phone: {testProfile.phone}</p>
                        </Card.Text>
                    </Card.Body>
                    <button className="Edit-btn" onClick={handleEditClick}>Edit Account</button>
                </Card>
            )}

                {activeTab === "favorites" && (
                    <Card className="favorites-card">
                        <Card.Body>
                            <Card.Title><h1>Favorite Stores</h1></Card.Title>
                            {testProfile.favlist_name.length > 0 && <p className='FSubheader'>Add Favorites from <a href="/List">Discover</a></p>}
                            {/* show list of favorite stores */}
                            <Card.Text>
                                {testProfile.favlist_name && testProfile.favlist_name.length > 0 ? (
                                    testProfile.favlist_name.map((id, index) => (
                                        <div className='d-flex justify-content-between'>
                                        <p key={index}>{id}</p>
                                        <button className="btn" onClick={() => handleFavoriteDelete(id)}>Delete</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>Don't See Any Stores? Go to <a href="/List">Discover</a></p>
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
                                    <label htmlFor="email" className="form-label">Email (Username)</label>
                                    <input type="email" className="form-control" id="email" name="email" value={editedProfile.email} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <input type="text" className="form-control" id="phone" name="phone" value={editedProfile.phone} onChange={handleChange} />
                                    <p className="form-text">Phone Optional: For Future Features</p>
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                        </Modal.Footer>
                    </Modal>
            </Container>
            
        </>
            
        );
}

export default ProfilePage
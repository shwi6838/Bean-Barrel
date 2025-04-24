import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Home.css";

// Banner images
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner4 from "../assets/banner4.jpg";
import banner5 from "../assets/banner5.jpg";

const banners = [banner1, banner2, banner4, banner5];

function HomePage() {
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);

  // Fetch user data (existing)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3080/auth/api/users", {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch shop data for reviews section
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get("http://localhost:3080/auth/api/shops", {
          withCredentials: true,
        });
        setShops(response.data)
      } catch (err) {
        console.error("Error fetching shops:", err);
      }
    };
    fetchShops();
  }, []);

  return (
    <>
      <NavBar />
  
      <div className="home-left-aligned container mt-5">
        <p className="subheading">Bar and Coffee Shop finder for Boulder, Colorado.</p>
  
        {/* Banner */}
        <div className="hero-images mt-3">
          {banners.map((img, i) => (
            <img key={i} src={img} alt={`Banner ${i + 1}`} className="hero-img" />
          ))}
        </div>
        {/* User Info */}
        <div className="mt-5">
          <h3 className="mb-3 section-heading">Welcome User: </h3>
          {users.length > 0 ? (
            users.map((user) => (
              <div color="Black" key={user.id || user.name}>
                <p><strong>{user.name}</strong></p>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
          
        </div>

        {/* Reviews Section */}
        <h3 className="mt-5 mb-3 section-heading">Recommendations & Reviews</h3>
        <div className="review-row">
          {shops.length > 0 ? (
            shops.slice(0, 3).map((shop, i) => (
              <div className="review-card" key={i}>
                <p className="fw-semibold">“{shop.shop_name}”</p>
                <p className="text-muted">Rating: {shop.rating || "N/A"}</p>
                <p className="text-muted">{shop.addr || "No location info"}</p>
              </div>
            ))
          ) : (
            <p>Loading reviews...</p>
          )}
        </div>
  
        {/* Optional: Show users pulled from the API */}
       
      </div>
  
      <Footer />
    </>
  );  
}

export default HomePage;
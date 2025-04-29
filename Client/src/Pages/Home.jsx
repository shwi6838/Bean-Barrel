import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Home.css";
import { Container, Carousel, Row, Col } from 'react-bootstrap';


// Banner images
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner4 from "../assets/banner4.jpg";
import banner5 from "../assets/banner5.jpg";
import logo from "../assets/BeanBarrel-Logo.png";


const banners = [banner1, banner2, banner4, banner5];

function HomePage() {
  const [users, setUsers] = useState([]);
  const [favshops, setFavShops] = useState([]);

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
    const fetchFavShops = async () => {
      try {
        const response = await axios.get("http://localhost:3080/auth/api/shops", {
          withCredentials: true,
        });
        setFavShops(response.data)
      } catch (err) {
        console.error("Error fetching shops:", err);
      }
    };
    fetchFavShops();
  }, []);

  return (
    <>
    <Container fluid className="home-page">
      {/* Hero Section */}
      <section id="Hero">
        <div id="Hero-left">
          <img src={logo} alt="Bean & Barrel Logo" className="logo" />
          <h1 className="home-title mb-4">Bean & Barrel</h1>
          <h4 className="subheading mb-3">Bar and Coffee Shop finder for Boulder, Colorado</h4>
        </div>
        {/* Hero Banner / Carousel */}
        <Carousel className="w-90 mx-auto" id="img-banner">
          {banners.map((img, i) => (
            <Carousel.Item>
              <img key={i} src={img} alt={`Banner ${i + 1}`} className="d-block hero-img" />
            </Carousel.Item>
          ))}
        </Carousel>
      </section>
        {/* About Section */}
        <section id="About">
        <Container>
          <h2 className="text-center mb-4 section-heading">About Bean & Barrel</h2>
          <p className="text-center mx-auto w-75">
            Bean & Barrel is a full-stack web application designed to help users find and see reviews of coffee shops and bars in Boulder, Colorado. 
            By combining user-friendly front-end design, robust back-end API management, and reliable data sources, it offers a seamless experience for discovering 
            local beverage establishments. This project not only enhances the way people explore and support local businesses but also fosters community connection 
            and informed decision-making.
          </p>

          <Row className="text-center mt-5">
            <Col md={4}>
              <i className="bi bi-geo-alt-fill display-4"></i>
              <h5 className="mt-3">Find</h5>
            </Col>
            <Col md={4}>
              <i className="bi bi-chat-dots-fill display-4"></i>
              <h5 className="mt-3">Review</h5>
            </Col>
            <Col md={4}>
              <i className="bi bi-heart-fill display-4"></i>
              <h5 className="mt-3">Save</h5>
            </Col>
          </Row>
        </Container>
        </section>
        {/* Favorites Section */}
        <section id="Favorites">
        <h3 className="mt-5 mb-3 section-heading">Favorite Stores</h3>
        <div className="review-row">
          {favshops.length > 0 ? (
            favshops.slice(0, 4).map((shop, i) => (
              <div className="review-card" key={i}>
                <p className="fw-semibold">“{shop.shop_name}”</p>
                <p className="text-muted">Rating: {shop.rating || "N/A"}</p>
                <p className="text-muted">{shop.addr || "No location info"}</p>
              </div>
            ))
          ) : (
            <p className="">Login and Discover shops to get Favorites</p>
          )}
        </div>
        </section>
        {/* Stores Section */}
        {/* <section id="Stores">
          <h3 className="mt-5 mb-3 section-heading">Discover Random Stores</h3>
          <div className="store-row">
            {randomStores.length > 0 ? (
              randomStores.map((store, i) => (
                <div className="store-card" key={i}>
                  <img src={store.image} alt={store.name} className="store-img" />
                  <h5>{store.name}</h5>
                  <p>{store.type}</p>
                  <p>{store.rating}</p>
                  <p>{store.addr}</p>
                </div>
              ))
            ) : (
              <p>No stores available</p>
            )}
          </div>
        </section> */}
        {/* Signup Section */}
        <section id="Signup">
          <h3 className="mt-5 mb-3 section-heading">Join the Community</h3>
          <p className="text-center mx-auto w-75 mb-4">
            Sign up today to start finding your favorite coffee shops and bars with the community. 
          </p>
          <div className="text-center mb-5">
            <a href="/register" className="btn">Sign Up</a>
          </div>
        </section>
      </Container>
    </>
  );  
}

export default HomePage;
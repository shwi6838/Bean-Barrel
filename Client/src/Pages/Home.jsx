import React, { useEffect, useState } from "react";
import NavBar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Home.css";
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner4 from "../assets/banner4.jpg";
import banner5 from "../assets/banner5.jpg";
import { LoadScript } from "@react-google-maps/api";

const banners = [banner1, banner2, banner4, banner5];

const placeIds = [
  "ChIJHSJLxCbsa4cRkw2E3vTDfzU", // Trident Booksellers and Cafe
  "ChIJhSE25ibsa4cREVN1cLEOh14", // OZO Coffee | West Pearl
  "ChIJX-Z3Mirsa4cR9WwdAf6suU0"  // Boxcar Coffee | Pearl Cafe and Bakery
];

function HomePage() {
  const [places, setPlaces] = useState([]);
  const [mapsReady, setMapsReady] = useState(false);

<<<<<<< HEAD
  //  Debug load of Maps SDK
  const handleMapsLoad = () => {
    console.log("Google Maps SDK fully loaded!");
    setMapsReady(true);
  };
=======
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
>>>>>>> 5a18ee307b797c4864b50d34f39887c33cdb9d63

  useEffect(() => {
    if (!mapsReady) {
      console.log("Maps not ready yet...");
      return;
    }

    console.log("Attempting to load place details...");
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));

    const getDetails = (placeId) =>
      new Promise((resolve, reject) => {
        service.getDetails(
          {
            placeId,
            fields: ["name", "rating", "reviews", "formatted_address"]
          },
          (place, status) => {
            console.log(`Fetching ${placeId} → Status: ${status}`);
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(place);
            } else {
              console.error(` Failed to fetch ${placeId}:`, status);
              reject(status);
            }
          }
        );
      });

    Promise.all(placeIds.map(getDetails))
      .then((results) => {
        console.log("All place data fetched:", results);
        setPlaces(results);
      })
      .catch((err) => {
        console.error("Error fetching places:", err);
      });
  }, [mapsReady]);

  return (
    <>
      <NavBar />

      <div className="home-left-aligned container mt-5">
        <p className="subheading">Bar and Coffee Shop finder for Boulder, Colorado.</p>

        <div className="hero-images mt-3">
          {banners.map((img, i) => (
            <img key={i} src={img} alt={`Banner ${i + 1}`} className="hero-img" />
          ))}
        </div>

        <h3 className="mt-5 mb-3 section-heading">Recommendations & Reviews</h3>

        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API}
          libraries={["places"]}
          onLoad={handleMapsLoad}
          onError={(e) => console.error(" Google Maps SDK failed to load:", e)}
        >
          <div className="review-row">
            {places.length > 0 ? (
              places.map((place, i) => (
                <div className="review-card" key={i}>
                  <p className="fw-semibold">“{place.name}”</p>
                  <p className="text-muted">Rating: {place.rating}</p>
                  <p className="text-muted">{place.formatted_address}</p>
                  {place.reviews?.slice(0, 1).map((review, rIdx) => (
                    <blockquote key={rIdx}>"{review.text}"</blockquote>
                  ))}
                </div>
              ))
            ) : (
              <p>Loading reviews...</p>
            )}
          </div>
        </LoadScript>
      </div>

      <Footer />
    </>
  );
}

export default HomePage;

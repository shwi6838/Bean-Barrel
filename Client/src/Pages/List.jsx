import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const googleKey = "AIzaSyDXX20zekFzs4PzfhQ6G9g_8RvBn5aPfl"; //add "w" in the end
// also check the api line of Server/Database/brew_data.py 
// and the api lines under function MapPage in Client/src/Pages/Map.jsx

function StoreListPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addingToFav, setAddingToFav] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/users", {
        withCredentials: true,
      });
      if (res.data.users && res.data.users.length > 0) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (err) {
      console.error("Auth check failed", err);
      setLoggedIn(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:3080/list/all", {
        withCredentials: true,
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (storeId) => {
    if (!loggedIn) return;
    setAddingToFav(storeId);
    try {
      await axios.post(
        "http://localhost:3080/api/favorites",
        { store_id: storeId },
        { withCredentials: true }
      );
      alert("Added to favorites!");
    } catch (err) {
      console.error("Failed to add to favorites", err);
      alert("Failed to add. Maybe already added?");
    } finally {
      setAddingToFav(null);
    }
  };

  const handleViewOnMap = (storeId) => {
    navigate(`/map?highlight=${storeId}`);
  };

  useEffect(() => {
    checkAuth();
    fetchStores();
  }, []);

  if (loading) return <div className="p-4">Loading stores...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">All Stores</h1>
      {stores.map((store) => (
        <div
          key={store._id}
          className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 shadow"
        >
          <img
            src={
              store.img
                ? `${store.img}&key=${googleKey}`
                : "/placeholder.jpg"
            }
            alt={store.name}
            style={{
              width: "50%",
              height: "200px", // or adjust to taste
              objectFit: "cover",
              objectPosition: "center 50%", // center vertically for middle crop
              borderRadius: "6px",
              flexShrink: 0,
            }}
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{store.name}</h2>
            <p className="text-sm text-gray-600 capitalize">
              {Array.isArray(store.types) ? store.types.join(", ") : store.types}
            </p>
            <p className="text-sm">Rating: {store.rating ?? "N/A"}</p>
            <p className="text-sm">
              <a
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Visit Website
              </a>
            </p>

            <p className="text-sm text-gray-700 mt-1">{store.address}</p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleAddFavorite(store._id)}
                disabled={!loggedIn || addingToFav === store._id}
                style={{
                  backgroundColor: "#357bc1",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: loggedIn ? "pointer" : "not-allowed",
                  opacity: loggedIn ? 1 : 0.6,
                }}
              >
                {addingToFav === store._id
                  ? "Adding..."
                  : loggedIn
                  ? "Add to Favorites"
                  : "Login to Add"}
              </button>
              <button
                onClick={() => handleViewOnMap(store._id)}
                style={{
                  backgroundColor: "#4e9af1",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                View on Map
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StoreListPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ListPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
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

  const fetchFavorites = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/favorites", {
        withCredentials: true,
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (storeId) => {
    try {
      await axios.delete(`http://localhost:3080/api/favorites/${storeId}`, {
        withCredentials: true,
      });
      setFavorites((prev) => prev.filter((s) => s.store_id !== storeId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchFavorites();
    } else {
      setLoading(false); // stop spinner if not logged in
    }
  }, [loggedIn]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (!loggedIn) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">You're not logged in</h2>
        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "var(--brand-color-dark)",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "var(--brand-color)")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "var(--brand-color-dark)")
          }
        >
          Log In to See Your List
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Saved Places</h1>
      {favorites.length === 0 ? (
        <p>No saved places yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((store) => (
            <div key={store._id} className="border rounded-lg p-4 shadow">
              <img
                src={store.image || "/placeholder.jpg"}
                alt={store.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-2">{store.name}</h2>
              <p className="text-gray-600">{store.address}</p>
              <p className="text-sm mt-1">Price: {store.price_level || "N/A"}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleRemove(store.store_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
                <button
                  onClick={() => alert("Details page coming soon!")}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListPage;

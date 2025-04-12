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
      const res = await axios.get("http://localhost:3080/list/favorites", {
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
      await axios.delete(`http://localhost:3080/list/favorites/${storeId}`, {
        withCredentials: true,
      });
      setFavorites((prev) => prev.filter((id) => id !== storeId));
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
            backgroundColor: "#357bc1", // was var(--brand-color-dark)
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
            (e.target.style.backgroundColor = "#4e9af1") // was var(--brand-color)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#357bc1")
          }
        >
          Log In to See Your List
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Saved Store IDs</h1>
      {favorites.length === 0 ? (
        <p>No saved places yet.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((storeId) => (
            <li
              key={storeId}
              className="border rounded p-3 flex items-center justify-between"
            >
              <span>{storeId}</span>
              <button
                onClick={() => handleRemove(storeId)}
                style={{
                  backgroundColor: "#357bc1", // was var(--brand-color-dark)
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#4e9af1") // was var(--brand-color)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#357bc1")
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from "react-router-dom";
import "../Map-List.css"

function StoreListPage() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addingToFav, setAddingToFav] = useState(null);
  const [sortOrder, setSortOrder] = useState("high"); // "high" or "low"
  const [selectedTypes, setSelectedTypes] = useState("cafe");
  const navigate = useNavigate();
  const googleKey = import.meta.env.VITE_GOOGLE_MAP_API; //check the .env files, make sure they are placed in Client and Server

  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:3080/auth/api/users", {
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
        "http://localhost:3080/list/favorites",
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

  const handleTypeChange = (event, newTypes) => {
    if (newTypes !== null) {
      setSelectedTypes(newTypes);
    }
  };
  
  
  // for showing todays hours
  const todayJsIdx = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  const todayIdx = todayJsIdx === 0 ? 6 : todayJsIdx - 1; // 0 (Mon) - 6 (Sun)
  
  useEffect(() => {
    checkAuth();
    fetchStores();
  }, []);
  
  useEffect(() => {
    let result = [...stores];
  
    // New filter logic
    result = result.filter((store) => {
      if (selectedTypes === "cafe") {
        return store.types.includes("cafe");
      }
      if (selectedTypes === "bar_restaurant") {
        return store.types.includes("bar") || store.types.includes("restaurant");
      }
      return true; // Show all if no type selected (though buttons enforce selection)
    });
  
    // Keep existing sort logic
    result.sort((a, b) => {
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;
      return sortOrder === "high" ? ratingB - ratingA : ratingA - ratingB;
    });
  
    setFilteredStores(result);
  }, [stores, sortOrder, selectedTypes]);

  if (loading) return <div className="p-4">Loading stores...</div>;

  return(
    <>
      <div className="p-4 space-y-4 list-page">
        <h2 className="text-2xl font-bold mb-4">Drinks in Boulder, CO</h2>

        {/*Filters & Sorting*/}
        <div className="sort-container flex flex-nowrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Type:</label>
            <ToggleButtonGroup value={selectedTypes} exclusive onChange={handleTypeChange} aria-label="type selection" size="small">
              <ToggleButton value="cafe" aria-label="cafe" sx={{'&.Mui-selected, &.Mui-selected:hover': {backgroundColor: '#43A047',color: '#fff',},}}>Coffee</ToggleButton>
              <ToggleButton value="bar_restaurant" aria-label="bar or restaurant" sx={{'&.Mui-selected, &.Mui-selected:hover': {backgroundColor: '#43A047',color: '#fff',},}}>Alcohol</ToggleButton>
            </ToggleButtonGroup>

          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort Ratings:</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option value="high">High → Low</option>
              <option value="low">Low → High</option>
            </select>
          </div>
        </div>
        {/* Store List */}
        {filteredStores.map((store) => (
          <div key={store.place_id} className="List-item">
            <div className="Img-Name-Type">
              <img src={
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
              }}/>
              <div className="flex-1">
                <div style={{ height: '5px' }} />
                <h4 className="text-xl font-semibold">{store.name}</h4>
                <p className="text-sm text-gray-600 capitalize">Type: {Array.isArray(store.types) ? store.types.join(", ") : store.types}</p>
                <p className="text-sm">Rating: {store.rating ?? "N/A"}</p>
                <p style={{ fontWeight: 'bold', color: '#007bff', margin:  '0' }}>Today: {store.opening_hours[todayIdx]}</p>
              </div>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-700 mt-1">{store.address}</p>
                <p className="text-sm text-gray-700 mt-1">{store.phone}</p>
                <p className="text-sm">
                  <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800"> Website</a>
                </p>
                <div className=" btn-container mt-4 flex gap-2">
                  <button
                    className="btn-add-fav"
                    onClick={() => handleAddFavorite(store.place_id)}
                    disabled={!loggedIn || addingToFav === store.place_id}
                    style={{
                      backgroundColor: "#60825e",
                      color: "white",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: loggedIn ? "pointer" : "not-allowed",
                      opacity: loggedIn ? 1 : 0.6,
                    }}
                  >
                    {addingToFav === store.place_id
                      ? "Adding..."
                      : loggedIn
                      ? "Add to Favorites"
                      : "Login to Add"}
                  </button>
                  <button
                    className="btn-view-map"
                    onClick={() => handleViewOnMap(store.place_id)}
                  >
                    View on Map
                  </button>
                </div>
              </div>
            </div>
        ))}
      </div>
    </>
  )

  // return (
  //     <div className="p-4 space-y-4">
  //       <h1 className="text-2xl font-bold mb-4">All Stores</h1>

  //       {/* Filters & Sorting */}
  //       <div className="flex flex-wrap gap-4 items-center">
  //         <div className="flex items-center gap-2">
  //           <label className="font-semibold">Filter by Type:</label>
  //           {["restaurant", "cafe", "bar"].map((type) => (
  //             <label key={type} className="flex items-center gap-1 text-sm">
  //               <input
  //                 type="checkbox"
  //                 checked={selectedTypes.includes(type)}
  //                 onChange={() => handleTypeToggle(type)}
  //               />
  //               {type}
  //             </label>
  //           ))}
  //         </div>
          
  //         <div className="ml-auto flex items-center gap-2">
  //           <label className="font-semibold">Sort by Rating:</label>
  //           <select
  //             value={sortOrder}
  //             onChange={(e) => setSortOrder(e.target.value)}
  //             className="border rounded px-2 py-1 text-sm"
  //           >
  //             <option value="high">High → Low</option>
  //             <option value="low">Low → High</option>
  //           </select>
  //         </div>
  //       </div>
        



  //       {filteredStores.map((store) => (
  //         <div
  //           key={store._id}
  //           className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 shadow"
  //         >
  //           <img
  //             src={
  //               store.img
  //                 ? `${store.img}&key=${googleKey}`
  //                 : "/placeholder.jpg"
  //             }
  //             alt={store.name}
  //             style={{
  //               width: "50%",
  //               height: "200px", // or adjust to taste
  //               objectFit: "cover",
  //               objectPosition: "center 50%", // center vertically for middle crop
  //               borderRadius: "6px",
  //               flexShrink: 0,
  //             }}
  //           />
  //           <div className="flex-1">
  //             <h2 className="text-xl font-semibold">{store.name}</h2>
  //             <p className="text-sm text-gray-600 capitalize">
  //               {Array.isArray(store.types) ? store.types.join(", ") : store.types}
  //             </p>
  //             <p className="text-sm">Rating: {store.rating ?? "N/A"}</p>
  //             <p className="text-sm">
  //               <a
  //                 href={store.url}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="text-blue-600 underline hover:text-blue-800"
  //               >
  //                 Visit Website
  //               </a>
  //             </p>

  //             <p className="text-sm text-gray-700 mt-1">{store.address}</p>

  //             <div className="mt-4 flex gap-2">
  //               <button
  //                 onClick={() => handleAddFavorite(store.place_id)}
  //                 disabled={!loggedIn || addingToFav === store.place_id}
  //                 style={{
  //                   backgroundColor: "#357bc1",
  //                   color: "white",
  //                   padding: "0.5rem 1rem",
  //                   border: "none",
  //                   borderRadius: "6px",
  //                   fontWeight: "bold",
  //                   cursor: loggedIn ? "pointer" : "not-allowed",
  //                   opacity: loggedIn ? 1 : 0.6,
  //                 }}
  //               >
  //                 {addingToFav === store.place_id
  //                   ? "Adding..."
  //                   : loggedIn
  //                   ? "Add to Favorites"
  //                   : "Login to Add"}
  //               </button>
  //               <button
  //                 onClick={() => handleViewOnMap(store.place_id)}
  //                 style={{
  //                   backgroundColor: "#4e9af1",
  //                   color: "white",
  //                   padding: "0.5rem 1rem",
  //                   border: "none",
  //                   borderRadius: "6px",
  //                   fontWeight: "bold",
  //                   cursor: "pointer",
  //                 }}
  //               >
  //                 View on Map
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  // );
}

export default StoreListPage;

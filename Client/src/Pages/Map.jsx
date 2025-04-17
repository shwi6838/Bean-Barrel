import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function MapPage() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const position = { lat: 40.015, lng: -105.2705 };
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get("http://localhost:3080/list/all");
                setShops(response.data);
            }   catch (error) {
                console.error("Error fecthing shos:", error);
            }   finally {
                setLoading(false);
            }
        }; 
        
        fetchShops();
    }, []);

    if (loading) return <div> Loading shops...</div>

    return (
        <div style={{ display: "flex", height: "79vh", width: "100vw" }}>
          {/* List of shops */}
          <div style={{ width: "50%", overflowY: "auto", padding: "1rem" }}>
            <h2>Shops in Boulder</h2>
            {shops.map((shop) => (
              <div key={shop._id} style={{ marginBottom: "1rem" }}>
                <h3>{shop.name}</h3>
                <p>{shop.address}</p>
              </div>
            ))}
        </div>

      {/* Map */}
      <div style={{ width: "50%", height: "100%" }}>
        <APIProvider apiKey={apiKey}>
          <Map defaultCenter={position} defaultZoom={13} style={{ height: "100%", width: "100%" }}>
            {shops.map((shop) => (
              <AdvancedMarker
                key={shop._id}
                position={{ lat: shop.lat, lng: shop.lng }}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

export default MapPage;

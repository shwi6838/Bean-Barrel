import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import axios from 'axios';

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
      <div style={{ width: "80%", height: "80%" }}>
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
  );
}

export default MapPage;

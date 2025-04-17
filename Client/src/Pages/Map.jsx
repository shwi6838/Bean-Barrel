import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import axios from 'axios';

function MapPage() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const position = { lat: 40.015, lng: -105.2705 };
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;;

   
    useEffect(() => {
        const fetchShops = async () => {
          try {
            const res = await axios.get("http://localhost:3080/list/all", {
              withCredentials: true,
            });
            console.log("Fetched shops:", res.data);
    
            // 可选：过滤掉无效坐标
            const validShops = res.data.filter(
              (shop) =>
                typeof shop.lat === "number" &&
                typeof shop.lng === "number" &&
                !isNaN(shop.lat) &&
                !isNaN(shop.lng)
            );
    
            setShops(validShops);
          } catch (error) {
            console.error("Error fetching shops:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchShops();
      }, []);
    
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={position}
              defaultZoom={13}
              style={{ height: "100%", width: "100%" }}
            >
            </Map>
          </APIProvider>
    
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                background: "white",
                padding: "10px 15px",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                zIndex: 1000,
                fontWeight: "bold",
              }}
            >
              Loading shops...
            </div>
          )}
        </div>
      );
}
export default MapPage
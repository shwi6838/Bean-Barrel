import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef, Pin } from "@vis.gl/react-google-maps";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// npm install @mui/material @emotion/react @emotion/styled

// Plotting the shops
function ShopMarker({ shop, isSelected, onClick, onClose }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const todayJsIdx = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  const todayIdx = todayJsIdx === 0 ? 6 : todayJsIdx - 1; // 0 (Mon) - 6 (Sun)

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: Number(shop.lat), lng: Number(shop.lng) }}
        title={shop.name}
        onClick={() => onClick(shop)}
      >
      </AdvancedMarker>
      {isSelected && marker && (
        <InfoWindow anchor={marker} onCloseClick={onClose}>
            <div style={{
              fontFamily: 'Segoe UI, Arial, sans-serif',
              padding: 8,
              lineHeight: 1.5
            }}>
            <h4 > {shop.name} </h4>
            <p>Rating: {shop.rating}</p>
            <div>
              <p>Today's Hours:</p>
              <p style={{ fontWeight: 'bold', color: '#007bff', margin: '4px 0' }}>
                {shop.opening_hours[todayIdx]}
              </p>
            </div>
            <div style={{ height: '10px' }} />
            <p>{shop.address}</p>
            <p>{shop.phone}</p>
            <a href={shop.url} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MapPage() {
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const position = { lat: 40.015, lng: -105.2705 };
    const apiKey = import.meta.env.VITE_GOOGLE_MAP_API;
    const mapKey = import.meta.env.VITE_GOOGLE_MAP_ID;
    const [selectedType, setSelectedType] = useState('cafe');

    const handleTypeChange = (event, newType) => {
      if (newType !== null) {
        setSelectedType(newType);
      }
    };
    
    const filteredShops = shops.filter(shop => {
      if (selectedType === "cafe") return shop.types === "cafe";
      if (selectedType === "bar_restaurant") return shop.types === "bar" || shop.types === "restaurant";
      return true;
    });
    console.log("filteredShops:", filteredShops);
    console.log("API Key:", apiKey);
    console.log("Map ID:", mapKey);
    
    // also check the api line of Server/Database/brew_data.py 
    // and the api line of Client/src/Pages/List.jsx
   
    useEffect(() => {
        const fetchShops = async () => {
          try {
            const res = await axios.get("http://localhost:3080/list/all", {
              withCredentials: true,
            });
            console.log("Fetched shops:", res.data);
            
            const validShops = res.data.filter(
              (shop) =>
                !isNaN(shop.lat) &&
                !isNaN(shop.lng)
            );
            console.log("Valid shops:", validShops);
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
      <>
        <div class="map-page">
          {loading && (
            <div className="loading-map">
              Loading shops...
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4">Drinks in Boulder, CO</h2>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex items-center gap-4 mb-4">
              <label className="font-semibold">Type:</label>
              <ToggleButtonGroup
                value={selectedType}
                exclusive
                onChange={handleTypeChange}
                aria-label="type selection"
                size="small"
              >
                <ToggleButton value="cafe" aria-label="cafe" 
                  sx={{
                    '&.Mui-selected, &.Mui-selected:hover': {
                      backgroundColor: '#43A047',
                      color: '#fff',
                    },
                  }}
                >
                  Coffee
                </ToggleButton>
                <ToggleButton value="bar_restaurant" aria-label="bar or restaurant"
                  sx={{
                      '&.Mui-selected, &.Mui-selected:hover': {
                        backgroundColor: '#43A047',
                        color: '#fff',
                    },
                  }}
                >
                  Alcohol
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

        </div>

          
        <APIProvider apiKey={apiKey}>
          <Map
          
            defaultCenter={position}
            defaultZoom={13}
            mapId={mapKey}
            style={{ height: "80%", width: "80%" }} 
            className="map" >

            {filteredShops.map((shop) => (
              <ShopMarker
                key={shop._id}
                shop={shop}
                isSelected={selectedShop && selectedShop._id === shop._id}
                onClick={() => setSelectedShop(shop)}
                onClose={() => setSelectedShop(null)}
                className="shop-marker"
              />
            ))}
          </Map>
        </APIProvider>
        </div>
      </>
    );
}
export default MapPage
import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";

// static testing data
// const STATIC_SHOPS = [
//   {
//     id: '68000f5a15a2d4e79db9028d',
//     name: "Bitty & Beau's Coffee",
//     lat: 40.0183667,
//     lng: -105.2761122,
//     placeId: 'ChIJ7YCA1wjta4cR8YQfbVRMc8I',
//     type: 'cafe',
//     icon: 'AeeoHcJYQcUollMJxQh16KTERX99tNqXHsBYHK1_NAAVX0Pa3qEugMdgZ_T0U_7g8CBvSijGGokPBFVMiyQlw_TNa1WWIdv9iAlU0HZVxfZJO5hK4Eq13WHsgYObNIrhhtDBbArKLM0YFmZBHGzRBjq3GrhLqIC0IRP1JZGBpt4Ad5LHq-28paqjXkiL4IM7c8IeSfltyE-pTz_B9zibZqh8rJ1VTvZLg1M-iODCxUvxy0jQoOBNPEc-s8KJZTyXIN3I_G0FgQgPLDqWOdiOrTaXMJiTKv8d_wfH9WvGvCwOyNlt2FuSPUo',
//     rating: 4.9,
//     reviews: 374,
//     priceLevel: 0,
//     address: '1468 Pearl St #120, Boulder',
//     openingHours: [
//       'Monday: 8:00 AM – 5:00 PM',
//       'Tuesday: 8:00 AM – 5:00 PM',
//       'Wednesday: 8:00 AM – 5:00 PM',
//       'Thursday: 8:00 AM – 5:00 PM',
//       'Friday: 8:00 AM – 5:00 PM',
//       'Saturday: 8:00 AM – 5:00 PM',
//       'Sunday: 8:00 AM – 5:00 PM'
//     ],
//     phone: '(720) 334-7050',
//     website: 'https://www.bittyandbeauscoffee.com/location/boulder/'
//   }
// ];


function MapPage() {
    //const [shops] = useState(STATIC_SHOPS);
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const position = { lat: 40.015, lng: -105.2705 };
    const apiKey = 'AIzaSyDXX20zekFzs4PzfhQ6G9g_8RvBn5aPflw'
    const mapKey = '5fef3ee35a17f3f5'
    
   
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
            mapId={mapKey}
            style={{ height: "100%", width: "100%" }} >

          {shops.map((shop) => (
            <AdvancedMarker
            key={shop.id}
            position={{ lat: shop.lat, lng: shop.lng }}
            title={shop.name}
            onClick={() => setSelectedShop(shop)}
            />
          ))}
          {selectedShop && (
            <InfoWindow
            position={{ lat: selectedShop.lat, lng: selectedShop.lng }}
            onCloseClick={() => setSelectedShop(null)}
            >
              <div>
                <h4>{selectedShop.name}</h4>
                <p>{selectedShop.address}</p>
                <p>Rating: {selectedShop.rating} ({selectedShop.reviews} reviews)</p>
                <a href={selectedShop.website} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              </div>
            </InfoWindow>
          )}
          </Map>
        </APIProvider>
  
        {loading && (
          <div
            style={{
              position: "flex",
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
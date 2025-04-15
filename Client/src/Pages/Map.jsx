import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

const position = { lat: 40.015, lng: -105.2705 }; // Boulder, CO


function MapPage() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    return (
        <div style={{ height: "79vh", width: "100vw", margin: 0, padding: 0 }}>
            <p title="Search result for Cafes in Boulder, CO" />
            <APIProvider apiKey = {apiKey}>
                <Map
                    width="50%"
                    height="50%"
                    defaultCenter={position}
                    defaultZoom={13}
                    style={{ border: 0 }}
                />
            </APIProvider>
        </div>
    );
}

export default MapPage;

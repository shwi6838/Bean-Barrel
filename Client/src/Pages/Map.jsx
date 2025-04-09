import React from "react";

function MapPage() {
    return (
        <div style={{ height: "79vh", width: "100vw", margin: 0, padding: 0 }}>
            <iframe
                title="Search result for Cafes in Boulder, CO"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/search?q=cafe&key=AIzaSyA70Gar_IcD8ukAkW1bOsVuniZEddlPAqM`}
            ></iframe>
        </div>
    );
}

export default MapPage;

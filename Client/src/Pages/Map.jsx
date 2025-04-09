import React from "react";

function MapPage() {
    return (
        <div>
            <h1>Map</h1>
            <iframe 
                title= 'Search result for Cafes in Boulder, CO' 
                width="600" height="450" style="border:0" loading="lazy" 
                allowfullscreen= ''
                src="https://www.google.com/maps/embed/v1/search?q=cafe&key=AIzaSyA70Gar_IcD8ukAkW1bOsVuniZEddlPAqM">
            </iframe>
        </div>
    );
}


export default MapPage
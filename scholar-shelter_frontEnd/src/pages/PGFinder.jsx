import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import RoomCard from "../components/RoomCard";
import Navbar from "../components/Navbar";
import { Search, Navigation, Milestone, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "../App.css";

// Fix Leaflet marker image asset bindings
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const pgIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Unique asset styling color to separate the user from the properties
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Helper component to smoothly transition map viewport focus when an active item changes
function MapViewFocusHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

const PGFinder = () => {
  const [pgs, setPgs] = useState([]); 
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [search, setSearch] = useState("");
  const [priceLimit, setPriceLimit] = useState(50000);
  
  // Selection States
  const [activePg, setActivePg] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeMetrics, setRouteMetrics] = useState({ distance: null, time: null });

  // Default focus coordinates (Dehradun)
  const [mapCenter, setMapCenter] = useState([30.3403, 77.9156]);

  // Fetch standard database listings
  useEffect(() => {
    axios.get('https://scholar-shelter.onrender.com/api/pgs/all')
      .then(res => {
        setPgs(res.data);
        setFilteredPgs(res.data);
        if (res.data.length > 0) {
          // Default center map to the first property if available
          setMapCenter([res.data[0].latitude || 30.3403, res.data[0].longitude || 77.9156]);
        }
      })
      .catch(err => console.error("Error loading properties:", err));
    
    // Request device geo-coordinates on initial interface paint
    getUserLiveCoordinates();
  }, []);

  // Filter listings based on search inputs
  useEffect(() => {
    const results = pgs.filter(pg => {
      const matchesLocation = pg.location?.toLowerCase().includes(search.toLowerCase());
      const matchesName = pg.name?.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = pg.price <= priceLimit;
      return (matchesLocation || matchesName) && matchesPrice;
    });
    setFilteredPgs(results);
  }, [search, priceLimit, pgs]);

  // Request browser geolocation access
  const getUserLiveCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
        },
        (error) => {
          console.warn("Location permission denied. Defaulting to university grid bounds.", error);
          // Fallback example: drop user marker directly inside Dev Bhoomi University gate point
          setUserLocation([30.3415, 77.9168]); 
        }
      );
    }
  };

  // Calculate high-speed geometric routing paths and distance profiles
  const handleSelectProperty = (pgItem) => {
    setActivePg(pgItem);
    const pgCoords = [pgItem.latitude, pgItem.longitude];
    setMapCenter(pgCoords);

    if (userLocation) {
      // Calculate Haversine Line-of-Sight distance factor
      const R = 6371; // Radius of the Earth in km
      const dLat = ((pgItem.latitude - userLocation[0]) * Math.PI) / 180;
      const dLon = ((pgItem.longitude - userLocation[1]) * Math.PI) / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLocation[0] * Math.PI) / 180) * Math.cos((pgItem.latitude * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
      // Pad total metric calculation slightly to simulate natural road turns
      const directKm = R * c;
      const estimatedRoadKm = directKm * 1.25; 
      const estimatedDrivingMinutes = Math.round(estimatedRoadKm * 2.5); // Baseline Dehradun traffic conversion index

      setRouteMetrics({
        distance: estimatedRoadKm.toFixed(1),
        time: estimatedDrivingMinutes
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="pg-finder-full-width">
        <header className="finder-hero-wide" style={{ padding: "20px 40px", background: "linear-gradient(135deg, #e6f0ff 0%, #f0f4ff 100%)" }}>
          <h1 style={{ margin: 0, fontSize: "1.8rem", color: "#1e293b" }}>Scholar Shelter Navigation</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b" }}>Select any accommodation listing below to instantly reveal routes and travel ranges.</p>
        </header>

        {/* Search Header Filters */}
        <div className="search-bar-center" style={{ padding: "12px 40px" }}>
          <div className="compact-search-box" style={{ display: "flex", gap: "12px", background: "#fff", padding: "8px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1, paddingLeft: "10px", gap: "8px" }}>
              <Search size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Type location or accommodation name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", width: "100%" }}
              />
            </div>
            <select className="compact-select" onChange={(e) => setPriceLimit(Number(e.target.value))}>
              <option value="50000">Any Budget</option>
              <option value="5000">Under ₹5k</option>
              <option value="8000">Under ₹8k</option>
              <option value="12000">Under ₹12k</option>
            </select>
          </div>
        </div>

        {/* Two-Column Split Dashboard Section */}
        <div className="finder-split-view" style={{ height: "calc(100vh - 220px)" }}>
          
          {/* Left Column: Listings Output */}
          <div className="listings-scroll-column">
            {filteredPgs.map((item) => (
              <div 
                key={item._id} 
                onClick={() => handleSelectProperty(item)}
                style={{ 
                  borderRadius: "16px",
                  transition: "all 0.2s",
                  border: activePg?._id === item._id ? "2px solid #0077ff" : "2px solid transparent",
                  background: activePg?._id === item._id ? "#f0f7ff" : "transparent"
                }}
              >
                <RoomCard pg={item} />
              </div>
            ))}
          </div>

          {/* Right Column: Advanced Leaflet Container Viewport */}
          <div className="map-sticky-column" style={{ position: "relative" }}>
            
            {/* Context Analytical Route Overlay HUD */}
            {activePg && userLocation && (
              <div className="routing-metrics-overlay">
                <div className="metric-pill-group">
                  <div className="metric-data-holder">
                    <Milestone size={18} color="#0077ff" />
                    Distance: <span>{routeMetrics.distance} km</span>
                  </div>
                  <div className="metric-data-holder">
                    <Navigation size={18} color="#22c55e" />
                    Estimated Travel: <span>{routeMetrics.time} mins</span>
                  </div>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Targeting: <strong>{activePg.name}</strong>
                </div>
              </div>
            )}

            <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapViewFocusHandler center={mapCenter} />

              {/* User Position Pin */}
              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup><strong>Your Current Position</strong></Popup>
                </Marker>
              )}

              {/* Properties Pins Rendering Engine */}
              {filteredPgs.map((item) => (
                item.latitude && item.longitude ? (
                  <Marker 
                    key={item._id} 
                    position={[item.latitude, item.longitude]} 
                    icon={pgIcon}
                    eventHandlers={{
                      click: () => handleSelectProperty(item),
                    }}
                  >
                    <Popup>
                      <div style={{ fontSize: "0.9rem" }}>
                        <strong style={{ color: "#0077ff" }}>{item.name}</strong><br />
                        Rent: ₹{item.price}/mo
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              ))}

              {/* Dynamic Path Routing Trail Line */}
              {activePg && userLocation && (
                <Polyline 
                  positions={[userLocation, [activePg.latitude, activePg.longitude]]} 
                  color="#0077ff"
                  weight={4}
                  opacity={0.8}
                  dashArray="10, 10"
                />
              )}
            </MapContainer>
          </div>

        </div>
      </div>
    </>
  );
};

export default PGFinder;
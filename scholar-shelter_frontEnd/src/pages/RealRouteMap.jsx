import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Navigation, ArrowLeft, ExternalLink, Compass } from "lucide-react";
import "leaflet/dist/leaflet.css";

// --- Leaflet Marker Asset Fixes ---
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const destinationIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const studentLiveIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Helper component that reframes the map area dynamically so both points stay perfectly visible
function AutoFitFilterBounds({ start, end }) {
  const map = useMap();
  useEffect(() => {
    if (start && end) {
      const bounds = L.latLngBounds([start, end]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [start, end, map]);
  return null;
}

// --- SUB-COMPONENT: REAL ROUTE MAP ---
const RealRouteMap = ({ pgName, pgLat, pgLng }) => {
  const [userCoords, setUserCoords] = useState(null);
  const [roadGeometry, setRoadGeometry] = useState([]);
  const [metrics, setMetrics] = useState({ distance: "Calculating...", duration: "" });
  const [mapError, setMapError] = useState("");

  const pgLocation = [Number(pgLat), Number(pgLng)];

  useEffect(() => {
    if (!navigator.geolocation) {
      setMapError("Geolocation tracking is not supported by your current browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = [position.coords.latitude, position.coords.longitude];
        setUserCoords(current);
        fetchRealRoadRoute(current, pgLocation);
      },
      (error) => {
        console.warn("Location tracking permission denied. Deploying Dehradun fallback baseline.");
        const fallbackCenter = [30.3403, 77.9156];
        setUserCoords(fallbackCenter);
        fetchRealRoadRoute(fallbackCenter, pgLocation);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [pgLat, pgLng]);

  const fetchRealRoadRoute = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      const response = await axios.get(url);

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const coordinatesPath = route.geometry.coordinates.map((point) => [point[1], point[0]]);
        
        setRoadGeometry(coordinatesPath);
        setMetrics({
          distance: `${(route.distance / 1000).toFixed(2)} km`,
          duration: `${Math.round(route.duration / 60)} mins walking route`
        });
      } else {
        setMapError("No valid walking paths found between markers.");
      }
    } catch (err) {
      console.error("OSRM Route Engine error:", err);
      setMapError("Could not calculate actual road tracks.");
    }
  };

  const launchExternalNavigation = () => {
    if (!userCoords) return;
    // FIXED: Corrected the template literal backtick evaluation format here 👇
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${userCoords[0]},${userCoords[1]}&destination=${pgLat},${pgLng}&travelmode=walking`, "_blank");
  };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", color: "#334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={18} color="#0077ff" /> Direction Analytics
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Actual street mapping metrics</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ background: "#f0f7ff", padding: "8px 14px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "700", color: "#0077ff" }}>{metrics.distance}</div>
          {metrics.duration && <div style={{ background: "#f0fdf4", padding: "8px 14px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "700", color: "#16a34a" }}>{metrics.duration}</div>}
        </div>
      </div>

      {mapError && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "12px" }}>⚠️ {mapError}</div>}

      <div style={{ height: "320px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
        <MapContainer center={pgLocation} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userCoords && <AutoFitFilterBounds start={userCoords} end={pgLocation} />}
          {userCoords && (
            <Marker position={userCoords} icon={studentLiveIcon}>
              <Popup><strong>Your Live Location</strong></Popup>
            </Marker>
          )}
          <Marker position={pgLocation} icon={destinationIcon}>
            <Popup><strong>{pgName}</strong></Popup>
          </Marker>
          {roadGeometry.length > 0 && (
            <Polyline positions={roadGeometry} color="#0077ff" weight={5} opacity={0.85} dashArray="3, 6" />
          )}
        </MapContainer>
      </div>

      <button 
        onClick={launchExternalNavigation}
        disabled={!userCoords}
        style={{ width: "100%", marginTop: "16px", background: "#1e293b", color: "#fff", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "700", cursor: userCoords ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
      >
        <ExternalLink size={16} /> Open Turn-by-Turn in Google Maps App
      </button>
    </div>
  );
};


// --- MAIN VIEW COMPONENT ---
const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  useEffect(() => {
    // Load user from storage
    const user = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(user);

    if (!id || id === "undefined") return;
    
    axios.get(`https://scholar-shelter.onrender.com/api/pgs/${id}`)
      .then(res => {
        setPg(res.data);
        setLoading(false);
        const saved = JSON.parse(localStorage.getItem('shortlistedPGs') || '[]');
        setIsFavorite(saved.some(item => item._id === id));
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const toggleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem('shortlistedPGs') || '[]');
    let updated;
    if (isFavorite) {
      updated = saved.filter(item => item._id !== id);
    } else {
      updated = [...saved, pg];
    }
    localStorage.setItem('shortlistedPGs', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://scholar-shelter.onrender.com/api/pgs/delete/${pg._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert("Property deleted successfully!");
        navigate("/search");
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete the property. Please try again.");
      }
    }
  };

  console.log("LOGGED IN USER:", loggedInUser);
  console.log("PG DATA FROM DB:", pg);
  console.log("CHECK MATCH:", loggedInUser?._id === pg?.ownerId);

  // CRITICAL LOADING GUARD: Halts mapping compilation until state variables are populated safely
  if (loading) return <div className="loading-state">Loading...</div>;
  if (!pg) return <div className="error-state">PG not found.</div>;
  if (!pg.latitude || !pg.longitude) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>Error: Accommodation coordinates could not be loaded securely.</div>;
  }

  const bgImage = pg.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";

  return (
    <>
      <Navbar />
      
      <div className="theme-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="theme-overlay">
          
          <div className="pg-main-container">
            
            {/* Action Bar (Back & Favorite) */}
            <div className="pg-action-bar">
              <button className="theme-circle-btn back-btn" onClick={() => navigate(-1)}>←</button>
              <button 
                className={`theme-circle-btn fav-btn ${isFavorite ? 'active' : ''}`} 
                onClick={toggleFavorite}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>

            {/* THE CARD: Glassmorphism container layout wrapper */}
            <div className="pg-glass-card">
              <div className="pg-top-hero-image">
                <img src={bgImage} alt={pg.name} />
              </div>
              
              <div className="pg-header-section">
                <span className="pg-badge">{pg.type}</span>
                <h1 className="pg-name">{pg.name}</h1>
                <p className="pg-location">📍 {pg.location}</p>
                <div style={{ display: "inline-block", background: "#e0efff", padding: "6px 12px", borderRadius: "8px", fontSize: "0.85rem", color: "#0056b3", fontWeight: "600", marginTop: "6px" }}>
                  🏛️ Hub Sector: <strong>{pg.nearUniversity || "Near University Hub"}</strong>
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="pg-stats-bar">
                <div className="stat">
                  <span className="stat-label">Monthly Rent</span>
                  <span className="stat-value">₹{pg.price}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Occupancy</span>
                  <span className="stat-value">Shared/Single</span>
                </div>
              </div>

              {/* Content Grid */}
              <div className="pg-grid">
                <div className="pg-info-col">
                  <h3>About this Property</h3>
                  <p className="pg-description">
                    {pg.description || "A wonderful place to stay, offering modern amenities in a convenient location. Perfect for students and working professionals looking for comfort and community."}
                  </p>

                  <h3>Amenities</h3>
                  <div className="amenities-flex">
                    {pg.amenities?.split(',').map((a, i) => (
                      <div key={i} className="amenity-tag">
                        <span className="dot"></span> {a.trim()}
                      </div>
                    ))}
                  </div>
                  
                  {/* Embedded Map Section */}
                  <div style={{ marginTop: "30px" }}>
                    <h3 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Navigation size={18} color="#0077ff" /> Live Road Route Path
                    </h3>
                    <RealRouteMap 
                      pgName={pg.name} 
                      pgLat={pg.latitude} 
                      pgLng={pg.longitude} 
                    />
                  </div>
                </div>

                {/* Sticky Contact Sidebar */}
                <div className="pg-contact-card">
                  <h3>Get in Touch</h3>
                  <div className="owner-profile">
                    <div className="owner-avatar">{pg.ownerName?.charAt(0) || 'O'}</div>
                    <div>
                      <p className="owner-name">{pg.ownerName || 'Owner'}</p>
                      <p className="owner-sub">Property Owner</p>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => window.open(`tel:${pg.contact}`)}>
                    📞 Call Owner
                  </button>
                  <button className="btn-secondary" onClick={() => window.open(`https://wa.me/${pg.contact}`)}>
                    💬 WhatsApp
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Owner Dashboard Control Center */}
          {loggedInUser && pg && pg.ownerId === loggedInUser._id && (
            <div className="owner-controls-container" style={{ display: "flex", gap: "12px", justifyContent: "center", padding: "20px 0" }}>
              <button className="edit-btn" onClick={() => navigate(`/edit-pg/${pg._id}`)}>
                Edit Property
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                Delete Property
              </button>
            </div>
          )}
          
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PGDetails;
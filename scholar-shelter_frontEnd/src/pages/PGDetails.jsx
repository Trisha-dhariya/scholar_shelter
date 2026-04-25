import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


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
    // [Keep the same useEffect logic as before]
    if (!id || id === "undefined") return;
    axios.get(`http://localhost:5000/api/pgs/${id}`)
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
    // [Keep the same toggleFavorite logic]
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
  console.log("LOGGED IN USER:", loggedInUser);
console.log("PG DATA FROM DB:", pg);
console.log("CHECK MATCH:", loggedInUser?._id === pg?.ownerId);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!pg) return <div className="error-state">PG not found.</div>;

  // Use the image from the DB as the full screen background
  const bgImage = pg.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";

  // deletion 
const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this property?");
  
  if (confirmDelete) {
    try {
      const token = localStorage.getItem("token"); // Get token for security
      await axios.delete(`http://localhost:5000/api/pgs/delete/${pg._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Property deleted successfully!");
      navigate("/search"); // Redirect back to listings
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete the property. Please try again.");
    }
  }
};
  return (
    <>
      <Navbar />
      {/* THEME WRAPPER: Handles the full-screen background image */}
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

            {/* THE CARD: Translucent white, raised up */}
            <div className="pg-glass-card">
              <div className="pg-top-hero-image">
                <img src={bgImage} alt={pg.name} />
              </div>
              
              <div className="pg-header-section">
                <span className="pg-badge">{pg.type}</span>
                <h1 className="pg-name">{pg.name}</h1>
                <p className="pg-location">📍 {pg.location}</p>
              </div>

              {/* Quick Stats Bar */}
              <div className="pg-stats-bar">
                <div className="stat">
                  <span className="stat-label">Monthly Rent</span>
                  <span className="stat-value">₹{pg.price}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Security</span>
                  <span className="stat-value">₹{pg.price * 2}</span>
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

            </div> {/* End pg-glass-card */}
          </div> {/* End pg-main-container */}
         {loggedInUser && pg && pg.ownerId === loggedInUser._id && (
              <div className="owner-controls-container">
                <button className="edit-btn" onClick={() => navigate(`/edit-pg/${pg._id}`)}>
                    Edit 
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                    Delete 
                </button>
              </div>
            )}
        </div> {/* End theme-overlay */}
      </div> {/* End theme-wrapper */}
      <Footer />
    </>
  );
};

export default PGDetails;
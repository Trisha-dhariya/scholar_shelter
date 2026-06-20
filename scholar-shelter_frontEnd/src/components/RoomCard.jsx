import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css";

function RoomCard({ pg }) {
  if (!pg) return null;

  return (
    // Wrap the entire card in a Link tag to make the whole area clickable
    <Link to={`/pg/${pg._id}`} className="room-card-link-wrapper" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="room-card-premium structural-hover-card">
        
        {/* Image Frame Section */}
        <div className="card-image-wrapper">
          <img 
            src={pg.image || "/images/default-pg.jpg"} 
            alt={pg.name} 
            className="card-main-img" 
          />
          <div className="badge-overlay">{pg.type || "PG"}</div>
        </div>

        {/* Content Presentation Section */}
        <div className="card-details-wrapper">
          <div className="details-header">
            <div className="header-left">
              <h2 className="pg-name-title">{pg.name}</h2>
              <p className="pg-area-text">📍 {pg.location}</p>
            </div>
            <div className="price-tag-container">
              <span className="amount">₹{pg.price}</span>
              <span className="duration">/mo</span>
            </div>
          </div>

          <div className="stats-row">
            <span className="stat-pill">🏠 {pg.distanceFromUni || "Near DBUU"}</span>
          </div>

          {/* Cleaned up Footer - Removed explicit click button */}
          <div className="card-actions-footer" style={{ marginTop: 'auto', paddingTop: '12px' }}>
            <p className="owner-credit" style={{ margin: 0 }}>By: <strong>{pg.ownerName}</strong></p>
            <span className="fake-link-text">
              Explore Stay →
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}

export default RoomCard;
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import "../App.css";

function RoomCard({ pg }) {
  if (!pg) return null;

  return (
    <div className="room-card-premium">
      <div className="card-image-wrapper">
        <img 
          src={pg.image || "/images/default-pg.jpg"} 
          alt={pg.name} 
          className="card-main-img" 
        />
        <div className="badge-overlay">{pg.type || "PG"}</div>
      </div>

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

        <div className="card-actions-footer">
          <p className="owner-credit">By: <strong>{pg.ownerName}</strong></p>
          {/* Use Link to navigate to the unique ID of the PG */}
          <Link to={`/pg/${pg._id}`} className="cta-btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
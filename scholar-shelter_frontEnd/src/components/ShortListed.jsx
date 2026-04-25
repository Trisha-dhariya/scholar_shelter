import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ShortListed = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shortlistedPGs") || "[]");
    setFavorites(saved);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((pg) => pg._id !== id);
    setFavorites(updated);
    localStorage.setItem("shortlistedPGs", JSON.stringify(updated));
    // Also remove from selection if it was there
    setSelectedForCompare(selectedForCompare.filter(item => item._id !== id));
  };

  const handleSelect = (pg) => {
    if (selectedForCompare.find(item => item._id === pg._id)) {
      setSelectedForCompare(selectedForCompare.filter(item => item._id !== pg._id));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare([...selectedForCompare, pg]);
      } else {
        alert("You can only compare two PGs at a time!");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="shortlist-viewport">
        <div className="shortlist-container">
          <div className="shortlist-header">
            <h1>❤️ My Shortlisted PGs</h1>
            <p>Select 2 properties to compare them side-by-side.</p>
            {selectedForCompare.length === 2 && (
              <button className="compare-floating-btn" onClick={() => setShowModal(true)}>
                Compare Now ({selectedForCompare.length})
              </button>
            )}
          </div>

          <div className="shortlist-grid">
            {favorites.map((pg) => {
              const isSelected = selectedForCompare.find(item => item._id === pg._id);
              return (
                <div key={pg._id} className={`fav-glass-card ${isSelected ? "selected-border" : ""}`}>
                  <div className="selection-badge" onClick={() => handleSelect(pg)}>
                    {isSelected ? "✅ Selected" : "➕ Compare"}
                  </div>
                  <div className="fav-card-image">
                    <img src={pg.image || "/images/placeholder.jpg"} alt={pg.name} />
                    <span className="fav-price-tag">₹{pg.price}/mo</span>
                  </div>
                  <div className="fav-card-content">
                    <h3>{pg.name}</h3>
                    <p className="fav-loc">📍 {pg.location}</p>
                    <div className="fav-actions">
                      <button className="view-btn" onClick={() => navigate(`/pg/${pg._id}`)}>View</button>
                      <button className="remove-fav-btn" onClick={() => removeFavorite(pg._id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* COMPARISON MODAL */}
          {showModal && (
            <div className="compare-modal-overlay">
              <div className="compare-modal-content">
                <button className="close-modal" onClick={() => setShowModal(false)}>✕</button>
                <h2>Comparison Table</h2>
                <div className="compare-table-wrapper">
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th>{selectedForCompare[0].name}</th>
                        <th>{selectedForCompare[1].name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Price</td>
                        <td>₹{selectedForCompare[0].price}</td>
                        <td>₹{selectedForCompare[1].price}</td>
                      </tr>
                      <tr>
                        <td>Type</td>
                        <td>{selectedForCompare[0].type}</td>
                        <td>{selectedForCompare[1].type}</td>
                      </tr>
                      <tr>
                        <td>Distance</td>
                        <td>{selectedForCompare[0].distanceFromUni}</td>
                        <td>{selectedForCompare[1].distanceFromUni}</td>
                      </tr>
                      <tr>
                        <td>Amenities</td>
                        <td>{selectedForCompare[0].amenities}</td>
                        <td>{selectedForCompare[1].amenities}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShortListed;
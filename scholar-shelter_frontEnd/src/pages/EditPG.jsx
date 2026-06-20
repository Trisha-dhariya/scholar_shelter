import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const EditPG = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    contact: "",
    location: "",
    latitude: "",
    longitude: "",
    distanceFromUni: "",
    price: "",
    type: "Boys",
    amenities: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [geoStatus, setGeoStatus] = useState(""); // Track coordinate lookups

  // 1. Fetch existing data on mount
  useEffect(() => {
    if (!id || id === "undefined") return;

    axios.get(`https://scholar-shelter.onrender.com/api/pgs/${id}`)
      .then((res) => {
        setFormData({
          ...res.data,
          latitude: res.data.latitude ?? "",
          longitude: res.data.longitude ?? ""
        });
        if (res.data.image) setPreview(res.data.image);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setMessage("❌ Could not load PG details.");
        setLoading(false);
      });
  }, [id]);

  // 🚀 AUTOMATION ENGINE: Listens to the location input and fetches coordinates automatically
  useEffect(() => {
    // Prevent triggering a lookup on empty fields or initial loads before details resolve
    if (!formData.location || formData.location.trim().length < 4 || loading) {
      return;
    }

    // Set a timer to wait 1 second after the user pauses typing
    const delayDebounceFn = setTimeout(async () => {
      setGeoStatus("🔍 Automatically identifying map pins...");

      try {
        const regionalQuery = `${formData.location}, Dehradun, Uttarakhand`;
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(regionalQuery)}&limit=1`
        );

        if (response.data && response.data.length > 0) {
          const topMatch = response.data[0];
          
          // Auto-fill coordinates instantly inside the master form state
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(topMatch.lat),
            longitude: parseFloat(topMatch.lon)
          }));

          setGeoStatus(`✅ Pin locked: ${parseFloat(topMatch.lat).toFixed(4)}, ${parseFloat(topMatch.lon).toFixed(4)}`);
        } else {
          setGeoStatus("⚠️ Location details are too vague. Add a landmark.");
        }
      } catch (err) {
        console.error("Auto-geocoding failed:", err);
        setGeoStatus("❌ Automatic lookup timed out.");
      }
    }, 1000); // 1-second debounce timeout threshold

    // Cleanup: Wipes the old timer if the user continues typing within that 1 second window
    return () => clearTimeout(delayDebounceFn);
  }, [formData.location, loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Updating listing...");

    const data = new FormData();
    
    Object.keys(formData).forEach((key) => {
      if (key !== "image" && formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    
    if (image) {
      data.append("image", image);
    }

    try {
      await axios.put(`https://scholar-shelter.onrender.com/api/pgs/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Updated Successfully!");
      setTimeout(() => navigate(`/pg/${id}`), 1500);
    } catch (err) {
      setMessage("❌ Update failed. Please try again.");
      console.error("Update Error:", err);
    }
  };

  if (loading) return <div className="loading-state">Loading details...</div>;

  return (
    <>
      <Navbar />
      <div className="add-pg-viewport">
        <div className="add-pg-stack">
          <div className="add-pg-header">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="back-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "10px",
                color: "#555"
              }}
            >
              ← Back
            </button>
            <h1>Edit Property</h1>
            <p>Update your property information below.</p>
          </div>

          <form onSubmit={handleSubmit} className="add-pg-main-form">
            {message && (
              <div className={`status-pill ${message.includes('❌') ? 'err' : 'ok'}`}>
                {message}
              </div>
            )}

            {/* Image Preview & Upload */}
            <div className="compact-upload-card">
              <div className="mini-preview-box">
                {preview ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <div className="placeholder-preview">No Image Available</div>
                )}
                <label className="change-img-label">
                  Change Image
                  <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                </label>
              </div>
            </div>

            {/* Input Grid */}
            <div className="details-input-card">
              <div className="form-grid-original">
                
                <div className="form-group">
                  <label>PG Name</label>
                  <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Owner Name</label>
                  <input type="text" name="ownerName" value={formData.ownerName || ""} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" name="contact" value={formData.contact || ""} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Monthly Rent (₹)</label>
                  <input type="number" name="price" value={formData.price || ""} onChange={handleChange} required />
                </div>

                {/* 📍 AUTOMATED DEBOUNCED LOCATION INPUT */}
                <div className="form-group">
                  <label>Location / Area</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location || ""} 
                    onChange={handleChange} 
                    placeholder="e.g. Bidholi, Premnagar"
                    required 
                  />
                  {geoStatus && (
                    <span style={{ 
                      fontSize: "0.78rem", 
                      marginTop: "4px", 
                      display: "block",
                      color: geoStatus.includes("✅") ? "#16a34a" : "#64748b",
                      fontWeight: "500"
                    }}>
                      {geoStatus}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Distance from Uni</label>
                  <input type="text" name="distanceFromUni" value={formData.distanceFromUni || ""} onChange={handleChange} />
                </div>

                {/* Map Latitude Input (Displays auto-fill value) */}
                <div className="form-group">
                  <label>Map Latitude</label>
                  <input 
                    type="number" 
                    step="any" 
                    name="latitude" 
                    value={formData.latitude} 
                    onChange={handleChange} 
                    placeholder="Auto-filled via location"
                  />
                </div>

                {/* Map Longitude Input (Displays auto-fill value) */}
                <div className="form-group">
                  <label>Map Longitude</label>
                  <input 
                    type="number" 
                    step="any" 
                    name="longitude" 
                    value={formData.longitude} 
                    onChange={handleChange} 
                    placeholder="Auto-filled via location"
                  />
                </div>

                <div className="form-group">
                  <label>PG Type</label>
                  <select name="type" value={formData.type || "Boys"} onChange={handleChange}>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Co-ed">Co-ed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Key Amenities</label>
                  <input type="text" name="amenities" value={formData.amenities || ""} onChange={handleChange} />
                </div>

              </div>

              <div className="form-group full-width">
                <label>Detailed Description</label>
                <textarea 
                  name="description" 
                  rows="4" 
                  value={formData.description || ""} 
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="submit-pg-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPG;
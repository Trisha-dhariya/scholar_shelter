import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AddPG = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    contact: "",
    location: "", // Tracks text address
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
  const [uploading, setUploading] = useState(false);
  const [geoStatus, setGeoStatus] = useState(""); // Track coordinate auto-fills

  useEffect(() => {
  if (!formData.location || formData.location.trim().length < 4) {
    setGeoStatus("");
    return;
  }

  const delayDebounceFn = setTimeout(async () => {
    setGeoStatus("🔍 Automatically identifying map pins...");

    try {
      const rawLocation = formData.location.trim();

      // 1. Clean the API query string without touching the original formData state
      let cleanQuery = rawLocation
        .replace(/\b\d{6}\b/g, "")                  // Removes postal codes (e.g., 248007)
        .replace(/,?\s*(Uttarakhand|India)/gi, "")  // Removes state/country repetition
        .replace(/\s+/g, " ");                      // Cleans up double spaces

      const addressParts = cleanQuery.split(",");
      
      // 2. Take up to the first 3 specific details (e.g., "DBIT chowk, Naugaon, Manduwala")
      if (addressParts.length > 3) {
        cleanQuery = `${addressParts[0].trim()}, ${addressParts[1].trim()}, ${addressParts[2].trim()}`;
      }

      // 3. Send the focused string to Nominatim, keeping it bound to Dehradun
      const searchQuery = `${cleanQuery}, Dehradun, Uttarakhand`;
      
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );

      if (response.data && response.data.length > 0) {
        const topResult = response.data[0];
        
        // Updates coordinates safely without overwriting the typed address string
        setFormData((prevData) => ({
          ...prevData,
          latitude: parseFloat(topResult.lat),
          longitude: parseFloat(topResult.lon)
        }));
        
        setGeoStatus(`✅ Pin locked: ${parseFloat(topResult.lat).toFixed(4)}, ${parseFloat(topResult.lon).toFixed(4)}`);
      } else {
        setGeoStatus("⚠️ Map engine confused by address format. Try simplifying slightly.");
      }
    } catch (err) {
      console.error("Geocoding Error:", err);
      setGeoStatus("❌ Automatic lookup timed out.");
    }
  }, 1000);

  return () => clearTimeout(delayDebounceFn);
}, [formData.location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user || !user._id) {
      setMessage("❌ Error: You must be logged in to list a PG.");
      return;
    }
    setUploading(true);
    setMessage("🚀 Uploading to Scholar Shelter...");
    
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    
    if (image) {
      data.append("image", image);
    }
    // Append ownerId from logged-in user session context
    data.append("ownerId", user._id);

    try {
      await axios.post("https://scholar-shelter.onrender.com/api/pgs/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Success! Redirecting...");
      setTimeout(() => navigate("/search"), 2000);
    } catch (err) {
      setMessage("❌ Error: Check connection or Image size.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
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
            <h1>List Your Property</h1>
            <p>Make your property more visible..</p>
          </div>

          <form onSubmit={handleSubmit} className="add-pg-main-form">
            {message && <div className={`status-pill ${message.includes('❌') ? 'err' : 'ok'}`}>{message}</div>}

            {/* COMPACT IMAGE CARD */}
            <div className="compact-upload-card">
              {!preview ? (
                <div className="upload-dropzone">
                  <span className="icon">📸</span>
                  <p>Click to Upload Photo</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="mini-preview-box">
                  <img src={preview} alt="Preview" />
                  <button type="button" className="mini-preview-box-btn" onClick={() => setPreview(null)}>Change Image</button>
                </div>
              )}
            </div>

            {/* RESTORED DATA CARD WITH COORDINATE GRID FIELDS */}
            <div className="details-input-card">
              <div className="form-grid-original">
                
                <div className="form-group">
                  <label>PG/Hostel Name</label>
                  <input type="text" name="name" placeholder="e.g. Royal Heritage PG" required onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Owner Name</label>
                  <input type="text" name="ownerName" placeholder="Your Full Name" required onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" name="contact" placeholder="10-digit number" required onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Monthly Rent (₹)</label>
                  <input type="number" name="price" placeholder="7000" required onChange={handleChange} />
                </div>

                {/* 📍 AUTOMATED LOCATION FIELD */}
                <div className="form-group">
                  <label>Location / Area</label>
                  <input type="text" name="location" placeholder="e.g. Manduwala" required onChange={handleChange} />
                  {geoStatus && (
                    <span className={`geo-status-text ${geoStatus.includes('✅') ? 'success' : 'searching'}`}>
                      {geoStatus}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Distance from Uni</label>
                  <input type="text" name="distanceFromUni" placeholder="e.g. 0.5 km" onChange={handleChange} />
                </div>

                {/* Map Latitude Input */}
                <div className="form-group">
                  <label>Map Latitude</label>
                  <input 
                    type="number" 
                    step="any" 
                    name="latitude" 
                    placeholder="e.g. 30.3403" 
                    value={formData.latitude}
                    onChange={handleChange} 
                  />
                </div>

                {/* Map Longitude Input */}
                <div className="form-group">
                  <label>Map Longitude</label>
                  <input 
                    type="number" 
                    step="any" 
                    name="longitude" 
                    placeholder="e.g. 77.9156" 
                    value={formData.longitude}
                    onChange={handleChange} 
                  />
                </div>

                <div className="form-group">
                  <label>PG Type</label>
                  <select name="type" onChange={handleChange} value={formData.type}>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Co-ed">Co-ed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Key Amenities</label>
                  <input type="text" name="amenities" placeholder="WiFi, AC, Food..." onChange={handleChange} />
                </div>

              </div>

              <div className="form-group full-width">
                <label>Detailed Description</label>
                <textarea name="description" rows="4" placeholder="Tell students about the room..." onChange={handleChange}></textarea>
              </div>

              <button type="submit" className="submit-pg-btn" disabled={uploading}>
                {uploading ? "Uploading..." : "Submit Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPG;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AddPG = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    contact: "",
    location: "",
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
    data.append("ownerId", user._id);}
   

    try {
      await axios.post("http://localhost:5000/api/pgs/add", data, {
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
            <h1>List Your Property</h1>
            <p>Make your property more visible..</p>
          </div>

          <form onSubmit={handleSubmit} className="add-pg-main-form">
            {message && <div className={`status-pill ${message.includes('❌') ? 'err' : 'ok'}`}>{message}</div>}

            {/* COMPACT IMAGE CARD (Kept the new style) */}
            <div className="compact-upload-card">
              {!preview ? (
                <div className="upload-dropzone">
                  <span className="icon">📸</span>
                  <p>Click to Upload Photo</p>
                  <input type="file" accept="image/*" onChange={handleFileChange}  />
                </div>
              ) : (
                <div className="mini-preview-box">
                  <img src={preview} alt="Preview" />
                  <button type="button" className="mini-preview-box-btn" onClick={() => setPreview(null)}>Change Image</button>
                </div>
              )}
            </div>

            {/* RESTORED FULL DATA CARD (Original Size & 8 Entries) */}
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

                <div className="form-group">
                  <label>Location / Area</label>
                  <input type="text" name="location" placeholder="e.g. Manduwala" required onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Distance from Uni</label>
                  <input type="text" name="distanceFromUni" placeholder="e.g. 0.5 km" onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>PG Type</label>
                  <select name="type" onChange={handleChange}>
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
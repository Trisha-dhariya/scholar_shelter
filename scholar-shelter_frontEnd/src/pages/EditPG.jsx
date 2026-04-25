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

  // 1. Fetch existing data
  useEffect(() => {
    // Basic safety check for ID
    if (!id || id === "undefined") return;

    axios.get(`http://localhost:5000/api/pgs/${id}`)
      .then((res) => {
        // We set the formData with the existing DB values
        setFormData(res.data);
        if (res.data.image) setPreview(res.data.image);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setMessage("❌ Could not load PG details.");
        setLoading(false);
      });
  }, [id]);

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
    
    // Append all text data
    Object.keys(formData).forEach((key) => {
      // Avoid appending the old image URL string to a file upload field
      if (key !== "image") {
        data.append(key, formData[key]);
      }
    });
    
    // Append new image only if user selected one
    if (image) {
      data.append("image", image);
    }

    try {
      await axios.put(`http://localhost:5000/api/pgs/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Updated Successfully!");
      // Redirect to the specific PG details page
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

            {/* Input Grid - All fields now use value={formData...} */}
            <div className="details-input-card">
              <div className="form-grid-original">
                
                <div className="form-group">
                  <label>PG Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Owner Name</label>
                  <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Monthly Rent (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Location / Area</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Distance from Uni</label>
                  <input type="text" name="distanceFromUni" value={formData.distanceFromUni} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>PG Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Co-ed">Co-ed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Key Amenities</label>
                  <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} />
                </div>

              </div>

              <div className="form-group full-width">
                <label>Detailed Description</label>
                <textarea 
                  name="description" 
                  rows="4" 
                  value={formData.description} 
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
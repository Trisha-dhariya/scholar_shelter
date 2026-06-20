import React, { useState, useEffect } from "react";
import axios from "axios";

const AutomatedPropertyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",  // The raw text address typed by the user
    latitude: "",  // Will automate fill
    longitude: "", // Will automate fill
    price: ""
  });

  const [geoStatus, setGeoStatus] = useState("");

  // 🚀 AUTOMATION ENGINE: Monitors changes to the location text field
  useEffect(() => {
    // If the address field is empty or too short, don't trigger a lookup
    if (!formData.location || formData.location.trim().length < 4) {
      setGeoStatus("");
      return;
    }

    // Set a timer to wait 1 second after the user stops typing
    const delayDebounceFn = setTimeout(async () => {
      setGeoStatus("🔍 Automatically identifying map pins...");

      try {
        // Appending region filters forces high-accuracy local results
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
          setGeoStatus("⚠️ Location text typed is too vague. Try adding a landmark.");
        }
      } catch (err) {
        console.error("Auto-geocoding failed:", err);
        setGeoStatus("❌ Automatic lookup timed out.");
      }
    }, 1000); // 1000 milliseconds = 1 second pause threshold

    // Cleanup function: clears the timer if the user types another letter before 1 second passes
    return () => clearTimeout(delayDebounceFn);
  }, [formData.location]); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "450px", margin: "auto", fontFamily: "sans-serif" }}>
      <h3>List New Accommodation</h3>
      
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "600", display: "block" }}>Enter Address / Landmark</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Bidholi, near Fuel Station"
          style={inputStyle}
        />
        {geoStatus && (
          <p style={{ 
            fontSize: "0.82rem", 
            marginTop: "6px", 
            color: geoStatus.includes("✅") ? "#16a34a" : "#64748b",
            fontWeight: "500"
          }}>
            {geoStatus}
          </p>
        )}
      </div>

      {/* Grid displays the auto-filled fields for confirmation (Read-Only) */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Latitude (Auto)</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            readOnly
            placeholder="Waiting for input..."
            style={{ ...inputStyle, background: "#f1f5f9", color: "#334155" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Longitude (Auto)</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            readOnly
            placeholder="Waiting for input..."
            style={{ ...inputStyle, background: "#f1f5f9", color: "#334155" }}
          />
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  marginTop: "4px"
};

export default AutomatedPropertyForm;
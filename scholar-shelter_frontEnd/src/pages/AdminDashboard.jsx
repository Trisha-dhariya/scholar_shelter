import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const MY_ADMIN_ID = "trisha";

if (!user || user._id !== MY_ADMIN_ID) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>🚫 Access Denied</h1>
        <p>You are not authorized to view this page.</p>
        <button onClick={() => window.location.href = "/"}>Back to Home</button>
      </div>
    );
  }

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    try {
      const res = await axios.get("https://scholar-shelter.onrender.com/api/pgs");
      setPgs(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load properties.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await axios.delete(`https://scholar-shelter.onrender.com/api/pgs/${id}`);
        setPgs(pgs.filter((pg) => pg._id !== id));
      } catch (err) {
        alert("Error deleting property");
      }
    }
  };

  return (
    <div className="admin-container" style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <p>Manage Property Listings</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {loading ? (
        <p>Loading listings...</p>
      ) : (
        <table className="admin-table" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
              <th>Name</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pgs.map((pg) => (
              <tr key={pg._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "15px 0" }}>{pg.name}</td>
                <td>{pg.ownerName}</td>
                <td>{pg.location}</td>
                <td>₹{pg.price}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(pg._id)}
                    style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
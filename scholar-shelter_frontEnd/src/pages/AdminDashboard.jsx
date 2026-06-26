import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: '0',
    totalListings: '0',
    pendingReviews: '0',
    newListings: '0',
    userVerifications: '0'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://scholar-shelter.onrender.com/api/admin';

  useEffect(() => {
    // 1. Define the fetch execution logic
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard-overview`);
        if (response.data) {
          // Updates numbers and calculations instantly across the screen
          setStats(response.data.stats);
          setRecentActivity(response.data.recentActivity);
        }
      } catch (err) {
        console.error("Automated background synchronization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    // 2. Trigger the fetch immediately upon loading the page
    fetchDashboardData();

    // 3. Set up the auto-update interval loop (Runs every 30 seconds)
    const updateInterval = setInterval(() => {
      console.log("Auto-calculating latest platform stats...");
      fetchDashboardData();
    }, 30000); // 30,000 milliseconds = 30 seconds

    // 4. Clean up the interval loop if you exit the page to prevent memory leaks
    return () => clearInterval(updateInterval);
  }, []);
  return (
    <div className="admin-container">
      {/* SIDEBAR VIEW */}
      <aside className="admin-sidebar">
        <div className="sidebar-menu">
          <button className="menu-item active"><span className="icon">📊</span> Dashboard Overview</button>
          <button className="menu-item"><span className="icon">👥</span> Manage Users</button>
          <div className="sub-menu-item">↳ Approval Queue</div>
          <button className="menu-item"><span className="icon">🏠</span> Manage Properties</button>
          <div className="sub-menu-item">↳ Review Listings</div>
          <button className="menu-item"><span className="icon">⭐</span> Shortlist Activity</button>
          <button className="menu-item"><span className="icon">⚙️</span> Settings</button>
          <button className="menu-item logout"><span className="icon">🚪</span> Logout</button>
        </div>
      </aside>

      {/* CORE WORKSPACE PANEL */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-brand">
            <div className="logo-placeholder">🏠</div>
            <h1>Scholar Shelter</h1>
          </div>
          <div className="header-profile">
            <span className="list-property-link">List Your Property</span>
            <div className="profile-badge">Priya</div>
          </div>
        </header>

        <div className="admin-workspace">
          <h2 className="workspace-title">Platform Overview</h2>

          {/* DYNAMIC CARD TILES */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Registered Users</span>
                <span className="stat-value">{stats.totalUsers}</span>
                <span className="stat-footer text-muted">Manual creation</span>
              </div>
              <button className="stat-action-btn">+</button>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Property Listings</span>
                <span className="stat-value">{stats.totalListings}</span>
                <span className="stat-badge pill-green">Active, {stats.pendingReviews} Pending Review</span>
              </div>
              <button className="stat-action-btn">▼</button>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">User Verifications</span>
                <span className="stat-value">{stats.userVerifications}</span>
                <span className="stat-badge pill-amber">Pending Approval</span>
              </div>
              <button className="stat-action-btn">❯</button>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Listings Submitted for Review</span>
                <span className="stat-value">{stats.newListings}</span>
                <span className="stat-badge pill-green">New</span>
              </div>
              <button className="stat-action-btn">❯</button>
            </div>
          </section>

          {/* COMMAND CENTER CONSOLE */}
          <section className="action-panel">
            <h3>Quick Action Center</h3>
            <div className="action-button-group">
              <button className="action-btn-primary alert-badge">Review New Properties</button>
              <button className="action-btn-primary">Verify New User Accounts</button>
            </div>

            <form className="notice-form" onSubmit={handleSendNotice}>
              <input 
                type="text" 
                placeholder="Enter your time notice..." 
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
              />
              <button type="submit" className="send-btn">Send</button>
            </form>

            <div className="filter-row">
              <select defaultValue=""><option value="" disabled>Filter Properties by: Location</option></select>
              <select defaultValue=""><option value="" disabled>Price Range</option></select>
              <input 
                type="text" 
                className="search-input" 
                placeholder="🔍 Search live system telemetry logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </section>

          {/* ACTIVITY SYSTEM ARCHIVE */}
          <section className="activity-panel">
            <h3>Recent System Activity</h3>
            <div className="table-responsive">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Property / System Log Detail</th>
                    <th>Status Context</th>
                    <th>Administrative Control</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivity.map((activity) => (
                    <tr key={activity._id}>
                      <td>{activity.detail}</td>
                      <td className={`status-cell ${activity.statusClass}`}>{activity.status}</td>
                      <td>
                        <button 
                          className="delete-log-btn"
                          onClick={() => handleDeleteListing(activity._id)}
                        >
                          🗑️ Purge Listing
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
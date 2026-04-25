
import { useNavigate } from "react-router-dom";
import "../App.css";

function UserPanel({ open, setOpen, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear the "Keycard" (Token) from the pocket
    localStorage.removeItem("token"); 
    setOpen(false);
    
    // 2. Redirect to landing page
    navigate("/"); 
    
    // 3. Force a reload to clear all React states (User becomes null)
    window.location.reload(); 
  };

  return (
    <>
      {/* Overlay: Closes drawer when clicking outside */}
      <div 
        className={`overlay ${open ? "show" : ""}`} 
        onClick={() => setOpen(false)}
      ></div>

      <div className={`drawer ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
        
        <div className="panel-content">
          {/* Conditional Rendering: Show profile if user data exists */}
          {user ? (
            <>
              <div className="profile-header">
                <img 
                  src={user.profilePic || "/images/user.png"} 
                  className="drawer-img" 
                  alt="User Profile" 
                />
                <h2 className="user-name-display">{user.userName}</h2>
                <p className="user-email-display">{user.email}</p>
              </div>

              <div className="divider"></div>

              <div className="menu-links">
                 <p onClick={() => { setOpen(false); navigate("/rooms"); }}>
                   <span>🏠</span> My Shortlisted PGs
                 </p>
                 <p onClick={() => { setOpen(false); navigate("/settings"); }}>
                   <span>⚙️</span> Account Settings
                 </p>
                 <p onClick={() => { setOpen(false); navigate("/help"); }}>
                   <span>❓</span> Help & Support
                 </p>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                Logout from Account
              </button>
            </>
          ) : (
            /* Show this if the Axios fetch hasn't finished yet */
            <div className="loading-panel">
              <p>Fetching your profile...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserPanel;
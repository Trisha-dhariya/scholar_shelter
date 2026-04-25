import "../App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserPanel from "./UserPanel";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Axios automatically throws an error for 4xx or 5xx responses
      const res = await axios.get("http://localhost:5000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Axios puts the response body inside 'data'
      setUser(res.data); 
    } catch (err) {
      console.error("Session expired or invalid:", err.response?.data || err.message);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  fetchUser();
}, []);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo-circle" onClick={() => navigate("/")}>
          <img src="/images/logo.jpeg" alt="Scholar Shelter" />
        </div>
        <h2 className="brand-name">Scholar Shelter</h2>
      </div>

      <ul className="nav-menu">
        <li><Link to="/search">Explore PGs</Link></li>
        <li><a href="/Home#about-section">About Us</a></li>
        <li><a href="#contact-section">Contact</a></li>
        <li><Link to="/addPg">Add PG</Link></li>
      </ul>

      <div className="nav-right">
        {/* New "Add PG" button for owners */}
        
        
        <div className="user-profile-trigger">
          <img
            src={user?.profilePic || "/images/user.png"}
            alt="user"
            className="user-img-nav"
            onClick={() => setOpen(true)}
          />
        </div>
        <UserPanel open={open} setOpen={setOpen} user={user} />
      </div>
    </nav>
  );
}

export default Navbar;
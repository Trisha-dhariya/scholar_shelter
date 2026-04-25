import { useNavigate } from "react-router-dom";
import "../App.css";

function SearchBar() {
  const navigate = useNavigate();

  return (
    <div className="hero-container">
      <div className="hero-content">
        {/* A more emotional, helping-focused headline */}
        <h1>Helping you find a place <br /> <span>to call home.</span></h1>
        <p>Simple, verified, and close to your university.</p>
        
        <div className="hero-search-wrapper">
          
          <button className="hero-search-btn" onClick={() => navigate("/search")}>
            Find My Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
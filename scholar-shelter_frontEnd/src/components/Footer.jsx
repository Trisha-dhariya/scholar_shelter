import { Link } from "react-router-dom";
import "../App.css";

function Footer({ showContact }) {
  return (
    <footer className="footer" id="contact-section">
      <div className="footer-container">
        
        {/* Column 1: Brand & Origin */}
        <div className="footer-column">
          <h3 className="footer-logo">Scholar Shelter</h3>
          <p className="footer-about">
            Helping students find their perfect home. Founded by students of 
            <strong> Dev Bhoomi Uttarakhand University</strong> for society upliftment.
          </p>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/search">Explore PGs</Link></li>
            <li><a href="#about-section">About Us</a></li>
            <li><Link to="/addPg">List Your PG</Link></li>
            <li><a href="#contact-sectin">Contact Support</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Details */}
        <div className="footer-column">
          <h4>Get In Touch</h4>
          <ul className="footer-contact">
            <li><span>📍</span> Dehradun, Uttarakhand, India</li>
            {/* You can replace this placeholder with your official email later */}
            <li><span>✉️</span> <a href="mailto:support@scholarshelter.com">support@scholarshelter.com</a></li>
            <li><span>📞</span> +91 XXXXX XXXXX</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Scholar Shelter. All rights reserved.</p>
        <div className="footer-socials">
          <span className="social-icon">Instagram</span>
          <span className="social-icon">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
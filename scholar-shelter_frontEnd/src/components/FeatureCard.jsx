import "../App.css";

function FeatureCard() {
  return (
    <div className="home-info-section" id="about-section">
      
      {/* --- About Us / Mission Section --- */}
      <div className="about-preview">
        <div className="about-text-content">
          <h4 className="subtitle">OUR MISSION</h4>
          <h2>Helping you find a place <span>to call home.</span></h2>
          <p>
            As students of <strong>Dev Bhoomi Uttarakhand University</strong>, we've seen 
            firsthand how difficult it is to find a safe and affordable PG. We built 
            <strong> Scholar Shelter</strong> to solve this problem for our community and 
            contribute to society upliftment.
          </p>
          <p>
            Our platform simplifies the search across various universities with smart 
            filters, shortlisted comparisons, and a direct bridge between owners and students.
          </p>
        </div>
      </div>

      {/* --- Feature Cards Grid --- */}
      <div className="features-container">
        <div className="feature-card">
          <div className="feature-icon-circle">🏠</div>
          <h3>Verified Owners</h3>
          <p>We only list trusted PG owners to ensure your safety and peace of mind.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-circle">🔍</div>
          <h3>Easy Search</h3>
          <p>Find rooms near your university instantly with our smart filtering system.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-circle">💰</div>
          <h3>Affordable Rooms</h3>
          <p>Budget-friendly options tailored for students. No hidden brokerage.</p>
           {/* <button className="feature-feedback-btn" onClick={onOpenFeedback}>
            Give Feedback
          </button> */}
        </div>
      </div>
      
    </div>
  );
}

export default FeatureCard;
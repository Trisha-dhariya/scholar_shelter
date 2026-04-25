// import "../App.css";
// import { Link } from "react-router-dom";

// function Front() {
//   return (
//     <div className="hero-viewport">
//       {/* Animated background blobs for depth */}
//       <div className="blob-bg"></div>
      
//       <div className="glass-card">
//         <div className="content-left">
//           <h1 className="hero-title">
//             Find Your <br />
//             <span>Perfect Stay</span>
//           </h1>
//           <p className="hero-subtitle">
//             Your home away from home is just a click away. Secure, affordable, and vetted student living.
//           </p>
          
//           <div className="action-cluster">
//             <Link to="/login" className="btn-primary">Get Started</Link>
//             <Link to="/signup" className="btn-secondary">Create Account</Link>
//           </div>
//         </div>

//         <div className="visual-right">
//           <div className="img-wrapper">
//              <Link to="/">
//                 <img 
//                   src="/images/logo.jpeg" 
//                   alt="logo" 
//                   className="hero-logo-main" 
//                 />
//              </Link>
//              <div className="status-badge">Available Now</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Front;
import "../App.css";
import { Link } from "react-router-dom";

function Front() {
  return (
    <div className="light-viewport">
      {/* Soft background accents */}
      <div className="light-blob"></div>
      
      <div className="custom-shape-card">
        <div className="content-section">
          
          <h1 className="main-heading">
            Find Your <br />
            <span className="blue-gradient-text">Perfect Stay</span>
          </h1>
          <p className="description">
            Experience premium student living near Universities. 
            Safe, verified, and designed for your comfort.
          </p>
          
          <div className="button-row">
            <Link to="/login" className="btn-solid-blue">Get Started</Link>
            <Link to="/signup" className="btn-ghost-blue">Create Account</Link>
          </div>
        </div>

        <div className="visual-section">
          <div className="logo-circle-wrapper">
             <Link to="/">
                <img 
                  src="/images/logo.jpeg" 
                  alt="logo" 
                  className="circle-logo-light" 
                />
             </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Front;
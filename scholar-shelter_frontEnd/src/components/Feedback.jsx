// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Send, ArrowLeft, MessageSquare, Star, Sparkles, CheckCircle2 } from 'lucide-react';
// import Modal from '../components/Modal';
// import '../App.css';

// const Feedback = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [formData, setFormData] = useState({
//     category: 'Suggestion',
//     message: '',
//     rating: 5
//   });
//   const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
//   const [loading, setLoading] = useState(false);

//   // Dynamic Rating Label
//   const getRatingLabel = (val) => {
//     const labels = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent!" };
//     return labels[val] || "";
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const res = await axios.get("https://scholar-shelter.onrender.com/api/user", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUser(res.data);
//       } catch (err) { navigate("/"); }
//     };
//     fetchUser();
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const token = localStorage.getItem("token");

//     try {
//       await axios.post("https://scholar-shelter.onrender.com/api/feedback/submit", 
//         { ...formData, userName: user.userName },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setIsSubmitted(true);
//       setModal({
//         isOpen: true,
//         title: 'Feedback Received!',
//         message: 'Your thoughts have been safely stored in the Scholar Shelter vault.',
//         type: 'success'
//       });
//       setFormData({ category: 'Suggestion', message: '', rating: 5 });
//     } catch (err) {
//       setModal({
//         isOpen: true,
//         title: 'Update Failed',
//         message: 'Could not send feedback. Please check your connection to the DBUU network.',
//         type: 'error'
//       });
//     } finally { setLoading(false); }
//   };

//   if (!user) return <div className="fb-loader">Loading...</div>;

//   return (
//     <div className="fb-page-container">
//       <Modal 
//         isOpen={modal.isOpen} 
//         onClose={() => {
//           setModal({ ...modal, isOpen: false });
//           if(isSubmitted) navigate(-1); // Redirect back after success
//         }}
//         title={modal.title}
//         message={modal.message}
//         type={modal.type}
//       />

//       <div className="fb-glass-card">
//         {isSubmitted ? (
//           <div className="fb-success-view">
//              <div className="fb-icon-badge success-anim">
//                 <CheckCircle2 size={40} />
//              </div>
//              <h2>Thank You, {user.userName}!</h2>
//              <p>Your feedback is vital for the upliftment of our student community.</p>
//              <button className="fb-submit-btn" onClick={() => navigate(-1)}>Go Back</button>
//           </div>
//         ) : (
//           <>
//             <div className="fb-header">
//               <button className="fb-back-circle" onClick={() => navigate(-1)}>
//                 <ArrowLeft size={20} />
//               </button>
//               <div className="fb-title-section">
//                 <div className="fb-icon-badge">
//                   <Sparkles size={24} className="fb-sparkle-icon" />
//                 </div>
//                 <h2>Share Your Thoughts</h2>
//                 <p>Help us make Scholar Shelter better for everyone</p>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="fb-form">
//               <div className="fb-input-box">
//                 <label>Feedback Category</label>
//                 <div className="fb-chip-group">
//                   {['Bug Report', 'Suggestion', 'Appreciation', 'Other'].map((cat) => (
//                     <button
//                       key={cat}
//                       type="button"
//                       className={`fb-chip ${formData.category === cat ? 'active' : ''}`}
//                       onClick={() => setFormData({ ...formData, category: cat })}
//                     >
//                       {cat}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="fb-input-box">
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <label>Overall Experience</label>
//                   <span className="fb-rating-label">{getRatingLabel(hoverRating || formData.rating)}</span>
//                 </div>
//                 <div className="fb-stars">
//                   {[1, 2, 3, 4, 5].map((num) => (
//                     <Star
//                       key={num}
//                       size={32}
//                       className={`fb-star-icon ${num <= (hoverRating || formData.rating) ? 'active' : ''}`}
//                       fill={num <= (hoverRating || formData.rating) ? "currentColor" : "none"}
//                       onMouseEnter={() => setHoverRating(num)}
//                       onMouseLeave={() => setHoverRating(0)}
//                       onClick={() => setFormData({ ...formData, rating: num })}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="fb-input-box">
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <label>Detailed Message</label>
//                   <span className="fb-char-count">{formData.message.length} / 500</span>
//                 </div>
//                 <textarea
//                   className="fb-textarea"
//                   maxLength="500"
//                   placeholder="Tell us what you liked or what needs improvement..."
//                   required
//                   value={formData.message}
//                   onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                 />
//               </div>

//               <button className="fb-submit-btn" type="submit" disabled={loading || !formData.message.trim()}>
//                 <span>{loading ? "Sending..." : "Submit Feedback"}</span>
//                 <Send size={18} className={loading ? "" : "fb-send-icon"} />
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Feedback;
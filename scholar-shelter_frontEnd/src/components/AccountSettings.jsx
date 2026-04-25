// import React, { useState, useEffect } from 'react'; // Added useEffect
// import { useNavigate } from "react-router-dom";
// import { User, Lock, Heart, LogOut } from 'lucide-react';
// import axios from 'axios'; // Added axios
// import '../App.css';

// const AccountSettings = ({ user: initialUser }) => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [user, setUser] = useState(initialUser || null); // Local state to hold user data
//   const navigate = useNavigate();

//   // Fetch user data specifically for this page if not passed as prop
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) return; // If user already exists via props, don't fetch again

//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/"); // Send to home if no token
//         return;
//       }

//       try {
//         const res = await axios.get("http://localhost:5000/api/user", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUser(res.data);
//       } catch (err) {
//         console.error("Error fetching settings data:", err);
//         navigate("/"); 
//       }
//     };

//     fetchUserData();
//   }, [user, navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token"); 
//     navigate("/"); 
//     window.location.reload(); 
//   };

//   // Show loading until user data is fetched
//   if (!user) return <div className="as-page-wrapper">Loading your profile...</div>;

//   return (
//     <div className="as-page-wrapper">
//       <div className="as-main-container">
        
//         {/* Sidebar */}
//         <aside className="as-sidebar-glass">
//           <div className="as-profile-box">
//             <div className="as-avatar-circle">
//               {user.userName ? user.userName[0].toUpperCase() : "U"}
//             </div>
//             <h3 style={{marginTop: '10px'}}>{user.userName}</h3>
//             <p style={{fontSize: '13px', color: 'gray'}}>{user.email}</p>
//           </div>

//           <nav className="as-nav-list">
//             <button 
//               className={`as-tab-btn ${activeTab === 'profile' ? 'as-active' : ''}`}
//               onClick={() => setActiveTab('profile')}
//             >
//               <User size={18} /> Profile
//             </button>
//             <button 
//               className={`as-tab-btn ${activeTab === 'security' ? 'as-active' : ''}`}
//               onClick={() => setActiveTab('security')}
//             >
//               <Lock size={18} /> Security
//             </button>
//             <button 
//               className="as-tab-btn"
//               onClick={() => navigate("/rooms")}
//             >
//               <Heart size={18} /> My Shortlist
//             </button>
//             <button className="as-tab-btn as-logout-btn" onClick={handleLogout}>
//               <LogOut size={18} /> Logout
//             </button>
//           </nav>
//         </aside>

//         {/* Content Area */}
//         <main className="as-content-card">
//           {activeTab === 'profile' && (
//             <div className="as-fade">
//               <h2 style={{marginBottom: '20px'}}>Profile Details</h2>
              
//               <div className="as-input-group">
//                 <label>Full Name</label>
//                 <input 
//                   type="text" 
//                   className="as-input-field" 
//                   defaultValue={user.userName} 
//                 />
//               </div>

//               <div className="as-input-group">
//                 <label>University</label>
//                 <input 
//                   type="text" 
//                   className="as-input-field" 
//                   defaultValue="Dev Bhoomi Uttarakhand University" 
//                 />
//               </div>

//               <div className="as-input-group">
//                 <label>Email Address</label>
//                 <input 
//                   type="email" 
//                   className="as-input-field" 
//                   defaultValue={user.email} 
//                   disabled 
//                   style={{ cursor: 'not-allowed', backgroundColor: 'rgba(0,0,0,0.05)' }}
//                 />
//               </div>

//               <button className="as-save-button">Save Changes</button>
//             </div>
//           )}

//           {activeTab === 'security' && (
//             <div className="as-fade">
//               <h2 style={{marginBottom: '20px'}}>Security Settings</h2>
//               <div className="as-input-group">
//                 <label>New Password</label>
//                 <input type="password" className="as-input-field" placeholder="••••••••" />
//               </div>
//               <div className="as-input-group">
//                 <label>Confirm Password</label>
//                 <input type="password" className="as-input-field" placeholder="••••••••" />
//               </div>
//               <button className="as-save-button">Update Password</button>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AccountSettings;
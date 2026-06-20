import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { User, Lock, Heart, LogOut, Camera, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import '../App.css';
import Modal from "./Modal";

const AccountSettings = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Profile Update States
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [email, setEmail] = useState(""); // Email is now editable state

  // Password States
  const [passwords, setPasswords] = useState({ newPass: '', confirmPass: '' });
 const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  // --- DATA FETCH ---

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/"); return; }

      try {
        const res = await axios.get("https://scholar-shelter.onrender.com/api/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setEmail(res.data.email); // Set initial email
        if (res.data.profileImage) setPreview(res.data.profileImage);
      } catch (err) {
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate]);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    // Logic: Email is sent to backend, Username is NOT
    formData.append("email", email); 
    if (image) formData.append("image", image);

    try {
      const res = await axios.put("https://scholar-shelter.onrender.com/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setModal({
      isOpen: true,
      title: 'Success!',
      message: 'Your profile has been updated successfully.',
      type: 'success'
    });

  } catch (err) {
    setModal({
      isOpen: true,
      title: 'Update Failed',
      message: 'Could not update profile. Please check your connection.',
      type: 'error'
    });
  } finally { setUploading(false); }
};

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
    setModal({
      isOpen: true,
      title: 'Validation Error',
      message: 'Passwords do not match!',
      type: 'error'
    });
    return;
  }
    const token = localStorage.getItem("token");
    try {
      await axios.put("http://localhost:5000/api/user/change-password", 
        { newPassword: passwords.newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModal({
      isOpen: true,
      title: 'Profile Updated',
      message: 'Your account details have been securely saved to Scholar Shelter.',
      type: 'success'
    });
     
    } catch (err)
    { setModal({
      isOpen: true,
      title: 'Update Failed',
      message: 'We could not save your changes. Please try again.',
      type: 'error'
    }); }
    setPasswords({ newPass: '', confirmPass: '' });
  };

  if (!user) return <div className="as-page-wrapper">Loading...</div>;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${user.userName}&background=0095f6&color=fff`;

  return (
    <div className="as-page-wrapper">
        <Modal 
      isOpen={modal.isOpen} 
      onClose={() => setModal({ ...modal, isOpen: false })}
      title={modal.title}
      message={modal.message}
      type={modal.type}
    />
      <div className="as-main-container">
        
        {/* Sidebar */}
        <aside className="as-sidebar-glass">
          <button className="as-back-btn" onClick={() => navigate("/home")}>
            <ArrowLeft size={18} /> <span>Back to Home</span>
          </button>

          <div className="as-profile-box">
            <div className="as-avatar-wrapper">
              <img src={preview || defaultAvatar} className="as-avatar-image" alt="Profile" />
              <label htmlFor="profile-upload" className="as-image-upload-label">
                <Camera size={14} />
                <input id="profile-upload" type="file" hidden accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <h3 style={{marginTop: '15px'}}>{user.userName}</h3>
            
          </div>

          <nav className="as-nav-list">
            <button className={`as-tab-btn ${activeTab === 'profile' ? 'as-active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={18} /> Profile
            </button>
            <button className={`as-tab-btn ${activeTab === 'security' ? 'as-active' : ''}`} onClick={() => setActiveTab('security')}>
              <Lock size={18} /> Security
            </button>
            <button className="as-tab-btn" onClick={() => navigate("/rooms")}>
              <Heart size={18} /> My Shortlist
            </button>
            <button className="as-tab-btn as-logout-btn" onClick={() => { localStorage.clear(); navigate("/"); window.location.reload(); }}>
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="as-content-card">
          {activeTab === 'profile' && (
            <div className="as-fade">
              <h2 className="as-content-title">Profile Details</h2>
              
              <div className="as-input-group">
                <label>Username </label>
                <input 
                   type="text" 
                   className="as-input-field" 
                   value={user.userName} 
                   disabled 
                   style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }} 
                />
              </div>

              <div className="as-input-group">
                <label>Email Address</label>
                <input 
                   type="email" 
                   className="as-input-field" 
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)} 
                   placeholder="Enter your new email"
                />
              </div>

              <button className="as-save-button" onClick={handleUpdateProfile} disabled={uploading}>
                {uploading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="as-fade">
              <h2 className="as-content-title">Security Settings</h2>
              <div className="as-input-group">
                <label>New Password</label>
                <input type="password" name="newPass" className="as-input-field" placeholder="Enter new password" value={passwords.newPass} onChange={(e) => setPasswords({...passwords, newPass: e.target.value})} />
              </div>
              <div className="as-input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPass" className="as-input-field" placeholder="Repeat new password" value={passwords.confirmPass} onChange={(e) => setPasswords({...passwords, confirmPass: e.target.value})} />
              </div>

              {passwords.confirmPass && passwords.newPass !== passwords.confirmPass && (
                <p className="as-error-text">Passwords do not match</p>
              )}

              <button className="as-save-button" onClick={handleUpdatePassword} disabled={!passwords.newPass || passwords.newPass !== passwords.confirmPass}>
                Update Password
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AccountSettings;
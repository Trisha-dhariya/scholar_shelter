import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import '../App.css';

const Modal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-content">
          <div className={`modal-icon-wrapper ${type}`}>
            {type === 'success' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
          </div>
          
          <h2 className="modal-title">{title}</h2>
          <p className="modal-message">{message}</p>
          
          <button className="modal-action-btn" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
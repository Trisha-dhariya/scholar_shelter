const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Import JWT to handle auth locally
const Ticket = require('../models/Ticket');

// --- LOCAL AUTH MIDDLEWARE ---
// This replaces the need for a separate file for now
const localAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (including id) to the request
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// --- NODEMAILER CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'scholarshelter.official@gmail.com',
    pass: 'your-app-password' // Use your 16-character Google App Password here
  }
});

// --- ROUTE: POST /api/support/ticket ---
router.post('/ticket', localAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;

    // 1. Save to Database
    const newTicket = new Ticket({
      userId: req.user.id, // Now works because of localAuth
      subject,
      message
    });
    await newTicket.save();

    // 2. Setup Email Content
    const mailOptions = {
      from: 'scholarshelter.official@gmail.com',
      to: 'your-personal-email@gmail.com', 
      subject: `New Support Ticket: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0095f6;">Scholar Shelter Support</h2>
          <p><strong>User ID:</strong> ${req.user.id}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">Notification from Scholar Shelter Backend</p>
        </div>
      `
    };

    // 3. Send the Email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Ticket sent and saved successfully!" });

  } catch (err) {
    console.error("Support Error:", err);
    res.status(500).json({ message: "Failed to process support request." });
  }
});

module.exports = router;
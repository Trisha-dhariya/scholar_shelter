const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedbackModel");
const jwt = require("jsonwebtoken");

router.post("/send", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newFeedback = new Feedback({
      userId: decoded.id,
      userName: req.body.userName,
      category: req.body.category,
      message: req.body.message
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback sent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send feedback" });
  }
});

module.exports = router;
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  category: { type: String, enum: ['Bug Report', 'Suggestion', 'Appreciation', 'Other'], default: 'Other' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
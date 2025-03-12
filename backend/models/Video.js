const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String },
  videoUrl: { type: String, required: false },
  filePath: { type: String, required: false },
}, { timestamps: false });

module.exports = mongoose.model('Video', videoSchema);

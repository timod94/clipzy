const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: false,
  },
  fileUrl: {
    type: String,
    required: false,
  },
  size: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false 
  }
});

module.exports = mongoose.model('Video', videoSchema);

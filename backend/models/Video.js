const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({

  title:        { type: String, required: false },
  description:  { type: String, required: false },
  videoUrl:     { type: String, required: false },
  filePath:     { type: String, required: false },
  videoKey:     { type: String, required: false},
  visibility:   { type: String, default: 'public', enum: [ 'public', 'private' ]},
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);

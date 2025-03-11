const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    key: { type: String, required: false },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    thumbnailKey: { type: String, required: false },
    videoUrl: { type: String, required: false }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;

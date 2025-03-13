const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const videoController = require('../controllers/videoController');

// Route für den Video-Upload
router.post('/upload', upload.single('video'), videoController.uploadVideo);

// Route zum Löschen eines Videos (und Thumbnails)
router.delete('/delete', videoController.deleteVideo);

// Route zum Abrufen der Videos
router.get('/', videoController.getVideos);

module.exports = router;

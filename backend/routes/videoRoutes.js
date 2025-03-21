const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const authenticateJWT  = require('../middleware/authMiddleware');
const videoController = require('../controllers/videoController');
const { getVideoUrls } = require('../controllers/getVideoUrls');

router.post('/upload', authenticateJWT,  upload.single('video'), videoController.uploadVideo);

router.delete('/delete', authenticateJWT, videoController.deleteVideo);

router.get('/',  authenticateJWT, getVideoUrls);

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const videoController = require('../controllers/videoController');
const { getVideoUrls } = require('../controllers/getVideoUrls');

router.post('/upload',  upload.single('video'), videoController.uploadVideo);

router.delete('/delete', videoController.deleteVideo);

router.get('/',  getVideoUrls);



module.exports = router;

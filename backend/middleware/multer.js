const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config/aws');

const upload = multer({
  limits: { fileSize: 100 * 1024 * 1024 },
  storage: multerS3({
    s3: s3,
    bucket: 'clipzy-bucket',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `videos/${Date.now()}_${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const mimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (mimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed', false));
    }
  }
});

module.exports = upload;

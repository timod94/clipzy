const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/aws');
const Video = require('../models/Video');

const deleteFileFromS3 = async (fileKey) => {
  const deleteParams = {
    Bucket: 'clipzy-bucket',
    Key: fileKey,
  };

  try {
    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log(`File ${fileKey} successfully deleted.`);
  } catch (error) {
    console.error(`Upload failed: ${fileKey}:`, error);
    throw error;
  }
};

exports.uploadVideo = (req, res) => {
  const { title, description, visibility } = req.body;
  const videoFile = req.file;
  const userId = req.user.id

  if (!videoFile) {
    return res.status(400).json({ error: 'No video file uplaoded' });
  }

  const videoKey = videoFile.key;
  const videoUrl = videoFile.location;
 

  const videoKeyParts = videoKey.split('/');
  const fileName = videoKeyParts[1]; 
  const timestamp = fileName.split('_')[0]; 
  const thumbnailKey = `thumbnails/${timestamp}_thumbnail.png`;

  
  const thumbnailPath = path.join(__dirname, '..', 'thumbnails', `${timestamp}_thumbnail.png`);

  ffmpeg(videoFile.location)
    .screenshots({
      count: 1,
      folder: path.dirname(thumbnailPath),
      filename: path.basename(thumbnailPath),
      size: '320x240',
    })
    .on('end', () => {

        const thumbnailUploadParams = {
        Bucket: 'clipzy-bucket',
        Key: thumbnailKey,
        Body: fs.createReadStream(thumbnailPath),
        ACL: 'public-read',
        ContentType: 'image/png',
      };

      s3.send(new PutObjectCommand(thumbnailUploadParams))
        .then(() => {
          const video = new Video({
            videoUrl,
            filePath: videoFile.location,
            visibility: visibility || 'public',
            videoKey,
            userId,
            title: req.body.title
          });

          video.save()
            .then(() => {
              res.status(200).json({
                videoUrl,
                thumbnailUrl: `https://clipzy-bucket.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailKey}`,
                videoKey,
                thumbnailKey,
              });
            })
            .catch((err) => {
              console.error('error saving video:', err);
              res.status(500).json({ error: 'Failed to save video to the database'})
            })
         })
        .catch((err) => {
          console.error('Thumbnail upload failed:', err);
          res.status(500).json({ error: 'Thumbnail upload failed' });
        });
    })
    .on('error', (err) => {
      console.error('Cannot create thumbnail:', err);
      res.status(500).json({ error: 'Cannot create thumbnail. Please try again!' });
    });
};

exports.deleteVideo = async (req, res) => {
  const { videoKey, thumbnailKey } = req.body;

  if ( !videoKey || !thumbnailKey ) {
    return res.status(400).json({ error: 'Both video and thumbnail keys are required' });
  }
  try {

    const video = await Video.findOne({ videoKey });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this video' });
    }

    await deleteFileFromS3(videoKey);
    await deleteFileFromS3(thumbnailKey);
    
    await Video.deleteOne({ videoKey });
    
    res.status(200).json({ message: 'Video file and thumbnail are successfully deleted' });
  } catch (error) {
    console.error('Cannot delete video file and thumbnail:', error);
    res.status(500).json({ error: 'An error occurred while deleting the file!' });
  }
};




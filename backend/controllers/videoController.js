const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/aws');
const Video = require('../models/Video');

// Hilfsfunktion zum Löschen von Dateien auf S3
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
  const videoFile = req.file;

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
          const videoUrl = videoFile.location;
          const thumbnailUrl = `https://clipzy-bucket.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailKey}`;

          
          // Hier die Daten in der DB speichern, falls nötig

          res.status(200).json({ videoUrl, thumbnailUrl, videoKey, thumbnailKey });
        })
        .catch((err) => {
          console.error('Thumbnail upload failed:', err);
          res.status(500).json({ error: 'Thumbain upload failed' });
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
    
    await deleteFileFromS3(videoKey);
    await deleteFileFromS3(thumbnailKey)
    
  
    res.status(200).json({ message: 'Video file and thumbnail are successfully deleted' });
  } catch (error) {
    console.error('Cannot delete video file and thumbnail:', error);
    res.status(500).json({ error: 'An error occurred while deleting the file!' });
  }
};


exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos); 
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving the videos' });
  }
};


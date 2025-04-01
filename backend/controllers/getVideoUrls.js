const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3 } = require('../config/aws');
const Video = require('../models/Video');

exports.getVideoUrls = async (req, res) => {
  const params = {
    Bucket: 'clipzy-bucket',
    Prefix: 'videos/', 
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(params));

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ error: 'No videos found' });
    }

    const userId = req.user.id; 
    const videos = await Video.find({ userId }); 

 
    const videoUrls = data.Contents.map((video) => {
      const videoUrl = `https://clipzy-bucket.s3.${process.env.AWS_REGION}.amazonaws.com/${video.Key}`;
      
 
      const dbVideo = videos.find(v => v.videoKey === video.Key);


      if (dbVideo) {
        const sharedLink = `${process.env.VITE_API_URL}/sharedVideo/${dbVideo._id}`;

        return {
          sharedLink,
          url: videoUrl,
          key: video.Key,
          title: dbVideo.title,
          description: dbVideo.description,
          visibility: dbVideo.visibility,
          userId: dbVideo.userId,
          _id: dbVideo._id,
        };
      }

      return null;
    }).filter(video => video !== null); 

    res.status(200).json(videoUrls);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Error fetching videos from S3' });
  }
};

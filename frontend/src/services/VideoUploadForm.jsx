import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import VideoDeleteForm from './VideoDeleteForm';
import '../App.css';

const VideoUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [videoKey, setVideoKey] = useState(null)
    const [thumbnailKey, setThumbnailKey] = useState(null)

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*',
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                setErrorMessage("Only video files are allowed!");
            } else {
                setErrorMessage('');
                handleVideoUpload(acceptedFiles);
            }
        }
    });

    const handleVideoUpload = async (files) => {
        const videoFile = files[0];
    
        if (!videoFile) {
            setErrorMessage("Please select a video file to upload.");
            return;
        }
    
        setUploading(true);
        setUploadError(null);
        setErrorMessage('');
    
        const formData = new FormData();
        formData.append('video', videoFile);
    
        const API_BASE_URL = 'http://localhost:5000/api/videos/';
    
        try {
            const response = await fetch(`${API_BASE_URL}upload`, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed. Please try again.');
            }
    
            const data = await response.json();
            setVideoUrl(data.videoUrl);
            setThumbnailUrl(data.thumbnailUrl);
            setVideoKey(data.videoKey)
            setThumbnailKey(data.thumbnailKey)

         
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError(error.message);
        } finally {
            setUploading(false);
        }
    };
   

    return (
        <div className="upload-container">
            {/* Dropzone für Datei-Uploads */}
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} accept="video/*" />
                <p className="dropzone-text">Drag & Drop a video file, or click to select one.</p>

                {uploading && <p className="status-text">Uploading...</p>}
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                {uploadError && <p className="error-text">{uploadError}</p>}
            </div>

            {/* Ausgabe für Video-URL und Thumbnail */}
            {videoUrl && (
                <div className="video-container">
                    <p className="upload-success">Video successfully uploaded!</p>

                    {/* Video-Abspiel-Option */}
                    <div className="video-preview">
                        <video className="video-player" width="600" controls>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Video löschen */}
                    <VideoDeleteForm 
                         videoUrl={videoUrl}
                         videoKey={videoKey}
                         thumbnailKey={thumbnailKey}
                         setVideoUrl={setVideoUrl}
                         setThumbnailUrl={setThumbnailUrl}
                         setVideoKey={setVideoKey}       
                         setThumbnailKey={setThumbnailKey} 
                         setUploadError={setUploadError}
                    />
                </div>
            )}

            {thumbnailUrl && (
                <div className="thumbnail-container">
                    <p className="thumbnail-text">Thumbnail preview:</p>
                    <img className="thumbnail-image" src={thumbnailUrl} alt="Thumbnail preview" />
                </div>
            )}
        </div>
    );
};

export default VideoUpload;
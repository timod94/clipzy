import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from 'react-router-dom';
import { FiUpload, FiVideo, FiInfo } from 'react-icons/fi'
import VideoDeleteForm from '../components/VideoDeleteForm';
import '../App.css';

const VideoUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [videoKey, setVideoKey] = useState(null);
    const [thumbnailKey, setThumbnailKey] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public')
    const [videoFile, setVideoFile] = useState(null)
    const [step, setStep] = useState(1);


    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*',
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                setErrorMessage("Only video files are allowed!");
            } else {
                setErrorMessage('');
                setVideoFile(acceptedFiles[0])
                setStep(2);
            }
        }
    });

    const handleVideoUpload = async (files) => {
        const token = localStorage.getItem('token');

    
        if (!videoFile) {
            setErrorMessage("Please select a video file to upload.");
            return;
        }
    
        setUploading(true);
        setUploadError(null);
        setErrorMessage('');
    
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('visibility', visibility);
    
        const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/videos/`;    

        try {
            console.log(videoFile)
            console.log(videoFile.location)
            const response = await fetch(`${API_BASE_URL}upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });
    
            if (response.status === 403) {
                throw new Error('Please log in to upload videos.');
              } else if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed. Please try again.');
              }
              
    
            const data = await response.json();
            setVideoUrl(data.videoUrl);
            setThumbnailUrl(data.thumbnailUrl);
            setVideoKey(data.videoKey)
            setThumbnailKey(data.thumbnailKey)
            setStep(3);

         
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setVideoFile(null);
        setTitle('');
        setDescription('');
        setVisibility('public');
        setStep(1);
    };
   

    return (
        <div className="upload-container">
            {/* Dropzone für Datei-Uploads */}
            {step === 1 && (
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} accept="video/*" />
                    <FiUpload className="upload-icon" size={48} />
                    <p className="dropzone-text">                        
                    <span><FiVideo /> MP4, WebM or OGG</span>
                    <span><FiInfo /> Max 100MB</span></p>

                    <button className="browse-button">Browse Files</button>
                        
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                </div>
            )}

            {step === 2 && (
                <div className="form-container">
                        <div className="file-preview">
                        <p className="file-name">
                            <FiVideo /> {videoFile.name}
                        </p>
                        <p className="file-size">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter video title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Tell viewers about your video"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="visibility-selector">

                    <label htmlFor="visibility">Choose visibility:</label>
                    <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                        <option value="public">Public (Visible to everyone)</option>
                        <option value="private">Private (Only visible to you)</option>
                    </select>
                    <p className="visibility-info">
                    Choose "Public" to share your video with everyone or "Private" to keep it visible only to you.
                    </p>
                    </div>
                    <button onClick={() => setStep(1)}>Back</button>
                    <button
                        onClick={handleVideoUpload}
                        disabled={!title || !description || !visibility}
                    >
                        Upload Video
                    </button>
                </div>
            )}
            

            {/* Ausgabe für Video-URL und Thumbnail */}
             {step === 3 && videoUrl && (
                <div className="video-container">
                    <h2 className="upload-success">Video successfully uploaded!</h2>
                    <p>Visit your <Link to="/profile">profile</Link> now to share this with others.</p>
                    <p>{title}</p>
                    <p>{description}</p>
                    <div className="video-preview">
                        <video className="video-player" width="600" controls>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        
                        <button onClick={resetForm} className="action-button">
                            Upload Another Video
                        </button>
                    </div>
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
        </div>
    );
};

export default VideoUpload;
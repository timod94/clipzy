import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
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
    
        const API_BASE_URL = `${VITE_API_URL}/api/videos/`;
    
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
   

    return (
        <div className="upload-container">
            {/* Dropzone für Datei-Uploads */}
            {step === 1 && (
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} accept="video/*" />
                    <p className="dropzone-text">Drag & Drop a video file, or click to select one.</p>
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                </div>
            )}

            {step === 2 && (
                <div className="form-container">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
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
                    <p className="upload-success">Video successfully uploaded!</p>
                    <p>{title}</p>
                    <p>{description}</p>
                    <div className="video-preview">
                        <video className="video-player" width="600" controls>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
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
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import './VideoUploadForm.css';
import VideoDeleteForm from './VideoDeleteForm'; // Importiere VideoDeleteForm

const VideoUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*',
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                setErrorMessage("Nur Video-Dateien sind erlaubt!");
            } else {
                setErrorMessage('');
                handleVideoUpload(acceptedFiles);
            }
        }
    });

    const handleVideoUpload = async (files) => {
        const videoFile = files[0];
    
        if (!videoFile) {
            setErrorMessage("Kein Video ausgewählt!");
            return;
        }
    
        setUploading(true);
        setUploadError(null);
        setErrorMessage('');
    
        const formData = new FormData();
        formData.append('video', videoFile);
    
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fehler beim Hochladen des Videos');
            }
    
            const data = await response.json();
            setVideoUrl(data.videoUrl);
            setThumbnailUrl(data.thumbnailUrl);
            alert('Video erfolgreich hochgeladen!');
        } catch (error) {
            console.error('Fehler beim Hochladen:', error);
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
                <p className="dropzone-text">Drag & Drop ein Video hier, oder klicke um auszuwählen</p>

                {uploading && <p className="status-text">Wird hochgeladen...</p>}
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                {uploadError && <p className="error-text">{uploadError}</p>}
            </div>

            {/* Ausgabe für Video-URL und Thumbnail */}
            {videoUrl && (
                <div className="video-container">
                    <p className="upload-success">Video erfolgreich hochgeladen!</p>

                    {/* Video-Abspiel-Option */}
                    <div className="video-preview">
                        <video className="video-player" width="600" controls>
                            <source src={videoUrl} type="video/mp4" />
                            Dein Browser unterstützt das Video-Tag nicht.
                        </video>
                    </div>

                    {/* Video löschen */}
                    <VideoDeleteForm 
                        videoUrl={videoUrl}
                        setVideoUrl={setVideoUrl}
                        setThumbnailUrl={setThumbnailUrl}
                        setUploadError={setUploadError}
                    />
                </div>
            )}

            {thumbnailUrl && (
                <div className="thumbnail-container">
                    <p className="thumbnail-text">Thumbnail Vorschau:</p>
                    <img className="thumbnail-image" src={thumbnailUrl} alt="Thumbnail Vorschau" />
                </div>
            )}
        </div>
    );
};

export default VideoUpload;

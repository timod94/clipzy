import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from 'axios'
import './uploader.css'

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
        setErrorMessage('');  // Stelle sicher, dass die Fehler-Nachricht zurückgesetzt wird
    
        const formData = new FormData();
        formData.append('video', videoFile);
    
        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });
    
            // Überprüfe die Antwort auf Fehlercodes
            if (!response.ok) {
                // Wenn der Statuscode nicht ok ist, dann holen wir die Fehlermeldung
                const errorData = await response.json();
                
                // Überprüfe speziell auf den Statuscode und zeige die entsprechende Fehlermeldung an
                if (response.status === 413) {
                    throw new Error('Die Datei ist zu groß! Maximale Dateigröße ist 50 MB.');
                } else if (response.status === 400) {
                    throw new Error(errorData.error || 'Ungültige Anfrage!');
                } else if (response.status === 500) {
                    throw new Error(errorData.error || 'Fehler auf dem Server!');
                } else {
                    throw new Error(errorData.error || 'Unbekannter Fehler!');
                }
            }
    
            // Wenn der Upload erfolgreich war, erhalten wir die Video- und Thumbnail-URLs
            const data = await response.json();
            setVideoUrl(data.videoUrl);
            setThumbnailUrl(data.thumbnailUrl);
            alert('Video und Thumbnail erfolgreich hochgeladen!');
        } catch (error) {
            console.error('Fehler beim Hochladen:', error);
            setUploadError(error.message);
        } finally {
            setUploading(false);
        }
    };
    

    const deleteVideo = async (videoUrl) => {
        const videoKey = videoUrl.split('amazonaws.com/')[1]; // Extrahiert den S3-Key aus der URL
        console.log("Versuche, das Video zu löschen. VideoKey:", videoKey);
    
        try {
            const response = await fetch('http://localhost:3000/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key: videoKey }), // Sende nur den Key
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Löschvorgang erfolgreich:', data);
                alert('Video erfolgreich gelöscht!');
                setVideoUrl(null);
                setThumbnailUrl(null);
            } else {
                console.error('Fehler beim Löschen:', data.error || 'Löschvorgang fehlgeschlagen!');
                setUploadError(data.error);
            }
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            setUploadError(error.message);
        }
    };
    
    
    
    return (
        <div className="upload-container">
            {/* Dropzone nur für Datei-Uploads */}
            <div
                {...getRootProps()}
                className="dropzone"
            >
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

                    <button className="delete-button" onClick={() => deleteVideo(videoUrl)}>Video löschen</button>
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
}    

export default VideoUpload;

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from 'axios';

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
    
        const formData = new FormData();
        formData.append('video', videoFile);
    
        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 413) {
                    throw new Error('Die Datei ist zu groß! Maximale Dateigröße ist 50 MB.');
                }
                throw new Error(errorData.error || 'Upload fehlgeschlagen!');
            }
    
            const data = await response.json();
            setVideoUrl(data.videoUrl);
            alert('Video erfolgreich hochgeladen! URL: ' + data.videoUrl);

            // Video hochgeladen, Thumbnail erstellen
            await handleThumbnailUpload(videoFile);
        } catch (error) {
            console.error('Fehler beim Hochladen:', error);
            setUploadError(error.message || 'Es gab ein Problem beim Hochladen des Videos!');
        } finally {
            setUploading(false);
        }
    };

    const handleThumbnailUpload = async (videoFile) => {
        const formData = new FormData();
        formData.append('thumbnail', videoFile); // Verwende die Video-Datei, um das Thumbnail zu erstellen
    
        try {
            const response = await axios.post('http://localhost:3000/uploadThumbnail', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                setThumbnailUrl(response.data.thumbnailUrl);
                console.log('Thumbnail hochgeladen:', response.data.thumbnailUrl);
            } else {
                throw new Error('Fehler beim Hochladen des Thumbnails!');
            }
        } catch (error) {
            console.error('Fehler beim Hochladen des Thumbnails:', error);
            setUploadError('Fehler beim Hochladen des Thumbnails!');
        }
    };

    const deleteVideo = async (key) => {
        try {
            const response = await fetch('http://localhost:3000/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key: key }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Datei erfolgreich gelöscht!');
            } else {
                throw new Error(data.error || 'Löschvorgang fehlgeschlagen!');
            }
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
        }
    }

    return (
        <div
            {...getRootProps()}
            style={{
                border: '2px dashed #ccc',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer'
            }}
        >
            <input {...getInputProps()} accept="video/*" />
            <p>Drag & Drop ein Video hier, oder klicke um auszuwählen</p>

            {uploading && <p>Wird hochgeladen...</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}

            {/* Video und Thumbnail URL anzeigen */}
            {videoUrl && <p>Video URL: <a href={videoUrl} target="_blank" rel="noopener noreferrer">{videoUrl}</a></p>}
            {thumbnailUrl && <p>Thumbnail URL: <a href={thumbnailUrl} target="_blank" rel="noopener noreferrer">{thumbnailUrl}</a></p>}
            {deleteVideo}
        </div>
    );
};

export default VideoUpload;

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const VideoUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); 

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
            setErrorMessage("Kein Video ausgewählt!");  // Zeigt Fehler an, wenn kein Video ausgewählt wurde
            return;
        }
    
        setUploading(true);
        setUploadError(null);
    
        const formData = new FormData();
        formData.append('video', videoFile);
    
        try {
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData
            });
    
            // Prüfen, ob die Antwort erfolgreich war
            if (!response.ok) {
                const errorData = await response.json(); // Fehlernachricht vom Server abfangen
    
                // Spezifische Behandlung für Fehler 413 (Datei zu groß)
                if (response.status === 413) {
                    throw new Error('Die Datei ist zu groß! Maximale Dateigröße ist 50 MB.');
                }
    
                throw new Error(errorData.error || 'Upload fehlgeschlagen!');
            }
    
            const data = await response.json();
            alert('Video erfolgreich hochgeladen! URL: ' + data.videoUrl);
        } catch (error) {
            console.error('Fehler beim Hochladen:', error);
    
            // Zeigt die spezifische Fehlermeldung im UI an
            setUploadError(error.message || 'Es gab ein Problem beim Hochladen des Videos!');
        } finally {
            setUploading(false);
        }
    };
    
    

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
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Zeigt die Fehlermeldung bei ungültigen Dateien */}
            {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>} {/* Zeigt Fehler, wenn Upload nicht erfolgreich war */}
        </div>
    );
};

export default VideoUpload;

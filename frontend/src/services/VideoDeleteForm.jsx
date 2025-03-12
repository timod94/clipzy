import React from 'react';

const VideoDeleteForm = ({ videoUrl, setVideoUrl, setThumbnailUrl, setUploadError }) => {
    // deleteVideo-Funktion, um das Video zu löschen
    const handleDelete = async () => {
        const videoKey = videoUrl.split('amazonaws.com/')[1]; // Extrahiert den S3-Key aus der URL
        console.log("Versuche, das Video zu löschen. VideoKey:", videoKey);

        try {
            // API-Aufruf, um das Video zu löschen
            const response = await fetch('http://localhost:5000/delete', {
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
                setVideoUrl(null);  // Setze die Video-URL auf null
                setThumbnailUrl(null);  // Setze das Thumbnail auf null
            } else {
                console.error('Fehler beim Löschen:', data.error || 'Löschvorgang fehlgeschlagen!');
                setUploadError(data.error);  // Fehlernachricht setzen
            }
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            setUploadError(error.message);  // Fehlernachricht setzen
        }
    };

    return (
        <div className="delete-container">
            <button className="Button"onClick={handleDelete}>Video löschen</button>
        </div>
    );
};

export default VideoDeleteForm;

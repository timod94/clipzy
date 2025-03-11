import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './videoList.css'; // Importiere das CSS

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/videos');
                console.log('API-Antwort:', response.data); // Überprüfe die API-Antwort
                setVideos(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Fehler beim Laden der Videos:', err); // Fehler protokollieren
                setError('Fehler beim Laden der Videos');
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return <p>Lade Videos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (videos.length === 0) {
        return <p>Keine Videos gefunden.</p>;
    }

    return (
        <div className="video-list">
            <h1>Video Liste</h1>
            <div className="video-grid">
                {videos.map((video) => (
                    <div className="video-card" key={video._id}>
                        <div className="video-thumbnail-container">
                            {/* Thumbnail anzeigen, falls vorhanden */}
                            {video.thumbnailUrl && (
                                <img
                                    src={video.thumbnailUrl}
                                    alt="Thumbnail"
                                    className="thumbnail"
                                />
                            )}

                            {/* Video anzeigen, falls vorhanden */}
                            {video.videoUrl && (
                                <video
                                    className="video-preview"
                                    preload="none" // Lade das Video erst bei Bedarf
                                    muted
                                    playsInline
                                    controls
                                    src={video.videoUrl}
                                />
                            )}
                        </div>

                        <div className="video-info">
                            <h3>{video.title || "Unbekannter Titel"}</h3>
                            <p>{video.description || "Keine Beschreibung verfügbar."}</p>
                            <div className="video-tags">
                                {video.tags && video.tags.length > 0 ? (
                                    video.tags.map((tag, index) => (
                                        <span key={index} className="tag">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span>Keine Tags</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoList;
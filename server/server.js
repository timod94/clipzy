require('dotenv').config();
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const cors = require('cors');
const mongoose = require('mongoose');
const Video = require('./models/video');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Datenbankverbindung erfolgreich!");
    })
    .catch((err) => {
        console.error("Fehler bei der Verbindung zur Datenbank:", err);
    });

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        sessionToken: process.env.AWS_SESSION_TOKEN,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 },
    storage: multerS3({
        s3: s3,
        bucket: 'clipzy-bucket',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, `videos/${Date.now()}_${file.originalname}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        const mimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (mimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Nur Video-Dateien sind erlaubt', false));
        }
    }
});

// Helper Funktion zum Löschen von Dateien auf S3
const deleteFileFromS3 = async (fileKey) => {
    const deleteParams = {
        Bucket: 'clipzy-bucket', 
        Key: fileKey,
    };

    try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log(`Datei ${fileKey} erfolgreich gelöscht.`);
    } catch (error) {
        console.error(`Fehler beim Löschen der Datei ${fileKey}:`, error);
        throw error;
    }
};

app.get('/', (req, res) => {
    res.send('Willkommen im Backend von Clipzy!')
})

// Route für das Video-Upload
app.post('/upload', upload.single('video'), (req, res) => {
    const videoFile = req.file;
    if (!videoFile) {
        return res.status(400).json({ error: 'Kein Video-Datei hochgeladen' });
    }

    const videoPath = videoFile.location; // Der Video-Pfad auf S3
    const thumbnailPath = path.join(__dirname, 'thumbnails', `${Date.now()}_thumbnail.png`);

    // Thumbnail aus Video extrahieren
    ffmpeg(videoPath)
        .screenshots({
            count: 1,
            folder: path.dirname(thumbnailPath),
            filename: path.basename(thumbnailPath),
            size: '320x240',
        })
        .on('end', () => {
            // Thumbnail hochladen
            const thumbnailUploadParams = {
                Bucket: 'clipzy-bucket',
                Key: `thumbnails/${path.basename(thumbnailPath)}`,
                Body: fs.createReadStream(thumbnailPath),
                ACL: 'public-read',
                ContentType: 'image/png',
            };

            s3.send(new PutObjectCommand(thumbnailUploadParams)) 
                .then(() => {
                    
                    // Erstelle die URLs
                    const videoUrl = videoFile.location;
                    const thumbnailUrl = `https://clipzy-bucket.s3.${process.env.AWS_REGION}.amazonaws.com/thumbnails/${path.basename(thumbnailPath)}`;

                    // Antwort mit den URLs
                    res.json({
                        videoUrl,
                        thumbnailUrl,
                    });
                })
                .catch((err) => {
                    console.error('Fehler beim Hochladen des Thumbnails:', err);
                    res.status(500).json({ error: 'Fehler beim Hochladen des Thumbnails' });
                });
        })
        .on('error', (err) => {
            console.error('Fehler beim Erstellen des Thumbnails:', err);
            res.status(500).json({ error: 'Fehler beim Erstellen des Thumbnails' });
        });
});

// Delete Route
app.delete('/delete', async (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ error: 'Kein Datei-Key angegeben' });
    }

    try {
        // Lösche das Video
        await deleteFileFromS3(key);

        const videoBaseName = path.basename(key, path.extname(key)); // Entferne die Dateiendung vom Video
        const timestamp = videoBaseName.split('_')[0]; // Extrahiere den Zeitstempel (z.B. '1741687378863' von '1741687378863_video.mp4')

        // Bilden des Thumbnail-Keys basierend auf dem Zeitstempel
        const thumbnailKey = `thumbnails/${timestamp}_thumbnail.png`;  

        // Lösche das Thumbnail
        await deleteFileFromS3(thumbnailKey);

        res.status(200).json({ message: 'Datei und Thumbnail erfolgreich gelöscht' });
    } catch (error) {
        console.error('Fehler beim Löschen der Datei oder des Thumbnails:', error);
        res.status(500).json({ error: 'Es gab ein Problem beim Löschen der Datei!' });
    }
});

// API-Route zum Abrufen von Videos
app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (err) {
        res.status(500).send({ error: 'Fehler beim Abrufen der Videos' });
    }
});

// Server starten
const port = 3000;
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
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
const { Upload } = require('@aws-sdk/lib-storage')

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



    const thumbnailDir = path.join(__dirname, 'thumbnails');
    if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir);
    }

    
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

// Standard Route
app.get('/', (req, res) => {
    res.send('Willkommen im Backend von Clipzy! Der Server läuft...');
});


// Video Upload Route
app.post('/upload', (req, res) => {
    upload.single('video')(req, res, async (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(413).json({ error: 'Die Datei ist zu groß! Maximal erlaubt: 50 MB.' });
                }
            }

            if (err.message === 'Nur Video-Dateien sind erlaubt') {
                return res.status(400).json({ error: 'Ungültiges Dateiformat. Nur Videos sind erlaubt!' });
            }

            return res.status(500).json({ error: 'Es gab ein Problem beim Hochladen des Videos!' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Kein Video wurde hochgeladen!' });
        }

        const thumbnailPath = path.join(__dirname, 'thumbnails', `${Date.now()}_thumbnail.png`);

        ffmpeg(req.file.location)
            .screenshots({
                count: 1,
                folder: 'thumbnails',
                filename: `${Date.now()}_thumbnail.png`,
                size: '320x240',
                timemarks: ['3']
            })
            .on('end', async () => {
                const newVideo = new Video({
                    key: req.file.key,
                    title: req.body.title || 'Untitled',
                    description: req.body.description || '',
                    tags: req.body.tags || [],
                    thumbnailUrl: `/thumbnails/${path.basename(thumbnailPath)}`,
                    videoUrl: req.file.location
                });

                try {
                    await newVideo.save();
                    res.status(200).json({
                        message: 'Video erfolgreich hochgeladen und Metadaten gespeichert',
                        videoUrl: req.file.location,
                        thumbnailUrl: `/thumbnails/${path.basename(thumbnailPath)}`
                    });
                } catch (error) {
                    console.error('Fehler beim Speichern der Metadaten:', error);
                    res.status(500).json({ error: 'Fehler beim Speichern der Videodaten!' });
                }
            })
            .on('error', (err) => {
                console.error('Fehler beim Erstellen des Thumbnails:', err);
                res.status(500).json({ error: 'Fehler beim Erstellen des Thumbnails!' });
            });
    });
});

// Upload Thumbnail Route
app.post('/uploadThumbnail', upload.single('thumbnail'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Kein Bild hochgeladen' });
    }

    // Erstelle den Dateinamen für das Thumbnail (basierend auf dem aktuellen Zeitstempel)
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const s3UploadParams = {
        Bucket: 'clipzy-bucket',                // Dein S3-Bucket
        Key: `thumbnails/${fileName}`,          // Der Pfad im S3-Bucket
        Body: req.file.buffer,                  // Direkt das Buffer der Datei hochladen (keine fs.createReadStream nötig)
        ACL: 'public-read',                     // Öffentlich lesbar
    };

    try {
        // Datei nach S3 hochladen
        await s3.send(new PutObjectCommand(s3UploadParams));

        // Erstelle die URL für das hochgeladene Bild
        const thumbnailUrl = `https://${s3UploadParams.Bucket}.s3.amazonaws.com/${s3UploadParams.Key}`;

        res.status(200).json({
            message: 'Thumbnail erfolgreich hochgeladen',
            thumbnailUrl: thumbnailUrl // Rückgabe der URL des Thumbnails
        });
    } catch (error) {
        console.error('Fehler beim Hochladen des Thumbnails:', error);
        res.status(500).json({ error: 'Fehler beim Hochladen des Thumbnails!' });
    }
});


// Delete Route
app.delete('/delete', async (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ error: 'Kein Datei-Key angegeben' });
    }

    try {
        const deleteParams = {
            Bucket: 'clipzy-bucket',
            Key: key,
        };

        await s3.send(new DeleteObjectCommand(deleteParams));
        res.status(200).json({ message: 'Datei erfolgreich gelöscht' });
    } catch (error) {
        console.error('Fehler beim Löschen der Datei:', error);
        res.status(500).json({ error: 'Es gab ein Problem beim Löschen der Datei!' });
    }
});

// Update Metadata Route
app.patch('/updateMetadata', async (req, res) => {
    const { key, title, description, tags } = req.body;

    if (!key) {
        return res.status(400).json({ error: 'Kein Video-Key angegeben' });
    }

    try {
        const video = await Video.findOneAndUpdate(
            { key: key },
            { title, description, tags },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ error: 'Video nicht gefunden!' });
        }

        res.status(200).json({
            message: 'Metadaten erfolgreich aktualisiert',
            video
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Metadaten:', error);
        res.status(500).json({ error: 'Es gab ein Problem beim Aktualisieren der Metadaten!' });
    }
});

// Check Metadata
app.get('/video/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const video = await Video.findOne({ key: key });

        if (!video) {
            return res.status(404).json({ error: 'Video nicht gefunden' });
        }

        res.status(200).json(video);
    } catch (error) {
        console.error('Fehler beim Abrufen der Videodaten:', error);
        res.status(500).json({ error: 'Es gab ein Problem beim Abrufen der Videodaten!' });
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

app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const cors = require('cors');

const app   = express();

app.use(cors({ origin: 'http://localhost:5173' }));


const s3    = new S3Client({

    region: process.env.AWS_REGION,
    credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});


const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024},
    storage: multerS3({
        s3: s3,
        bucket: 'clipzy-bucket',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, `videos/${Date.now()}_${file.originalname}`);  // Dateiname auf Basis von Zeit und Originalname
        }
    }),
    fileFilter: ( req, file, cb ) => {
        const mimeTypes = ['video/mp4', 'video/webm', 'video/ogg',];
        if (mimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Nur Video-Dateien sind erlaubt', false))
        }
    }
});

app.get('/', (req, res) => {
    res.send('Willkommen im Backend von Clipzy! Der Server läuft...')
});

app.post('/upload', (req, res, next) => {
    upload.single('video')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                // Behandlung des 413-Fehlers für zu große Dateien
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(413).json({ error: 'Die Datei ist zu groß! Maximal erlaubt: 50 MB.' });
                }
            }

            if (err.message === 'Nur Video-Dateien sind erlaubt') {
                // Fehlermeldung für ungültiges Dateiformat
                return res.status(400).json({ error: 'Ungültiges Dateiformat. Nur Videos sind erlaubt!' });
            }

            // Allgemeiner Upload-Fehler
            return res.status(500).json({ error: 'Es gab ein Problem beim Hochladen des Videos!' });
        }

        if (!req.file) {
            // Fehlermeldung, wenn kein Video hochgeladen wurde
            return res.status(400).json({ error: 'Kein Video wurde hochgeladen!' });
        }

        // Erfolgreiche Upload-Antwort
        res.status(200).json({
            message: 'Video erfolgreich hochgeladen',
            videoUrl: req.file.location
        });
    });
});



app.listen(3001, () => {
    console.log('Server läuft auf http://localhost:3001');
});


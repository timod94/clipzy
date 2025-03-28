require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('./config/passportConfig');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
const authMiddleware = require('./middleware/authMiddleware');

const createApp = () => {
  const app = express();
  
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: { secure: false }
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api/videos', videoRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/auth', googleAuthRoutes);

  app.get('/api/status', (req, res) => {
    res.json({ status: 'OK' });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  });

  return { app };
};

if (require.main === module) {
  const { app } = createApp();
  connectDB();
  
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server runs on http://0.0.0.0:${port}`);
  });
}

module.exports = { createApp };
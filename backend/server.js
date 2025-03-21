require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('./config/passportConfig');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const session = require('express-session')
const authMiddleware = require('./middleware/authMiddleware')
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);

// check up route
app.get('/', (req, res) => {
  res.send('Welcome to Clipzy Backend!');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server runs on http://localhost:${port}`);
});
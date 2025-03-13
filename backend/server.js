require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173'}));
app.use(express.json());

connectDB();

app.use('/api/videos', videoRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Clipzy Backend!');
});

// express-fehler-middleweare 

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server runs on http://localhost:${port}`);
});
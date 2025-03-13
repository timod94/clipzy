const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DATABASE CONNECTION SUCCESSFUL!');
  } catch (err) {
    console.error('ERROR CONNECTING TO THE DATABASE!:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

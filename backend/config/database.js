const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI), {
    monitorCommands: false,
    loggerLevel: 'error',
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  }
    console.log('!Database connection SUCCESSFUL!');
  } catch (err) {
    console.error('!ERROR connecting to the database!:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

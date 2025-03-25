const mongoose = require('mongoose');

const connectTestDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/clipzy-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    console.error('Test DB connection error:', err);
    throw err;
  }
};

module.exports = connectTestDB;
const mongoose = require('mongoose');
const User = require('../models/User');

const TEST_DB_URI = 'mongodb://localhost:27017/clipzy-test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteOne({ email: 'test@example.com' });
});

test('User-Modell speichert korrekt', async () => {
  const testUser = new User({
    username: 'testuser',
    email: 'test@example.com', 
    password: 'test123'
  });
  
  const savedUser = await testUser.save();
  expect(savedUser.email).toBe('test@example.com');
});
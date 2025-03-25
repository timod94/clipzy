const request = require('supertest');
const express = require('express');

const createTestApp = () => {
  const app = express();
  app.get('/api/status', (req, res) => res.sendStatus(200));
  return app;
};

describe('Basic Test', () => {
  it('should return 200', async () => {
    const app = createTestApp();
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
  });
});
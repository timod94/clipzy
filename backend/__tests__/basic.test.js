const request = require('supertest');
const express = require('express');

const app = express();
app.get('/api/status', (req, res) => res.status(200).json({ status: 'OK' }));

describe('Basic Test', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
  });
});
const request = require('supertest');
const { createApp } = require('../server');

describe('API Tests', () => {
  let app;

  beforeAll(() => {
    const { app: expressApp } = createApp();
    app = expressApp;
  });

  it('GET /api/status should return 200', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'OK' });
  });
});s
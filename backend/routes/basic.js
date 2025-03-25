const request = require('supertest');
const { createApp } = require('../server');

let app;
let server;

beforeAll(async () => {
  const { app: expressApp, server: expressServer } = createApp();
  app = expressApp;
  server = expressServer;
});

afterAll(async () => {
  if (server) await server.close();
});

describe('Basic API Tests', () => {
  it('GET /api/status - should return 200', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
  });
});
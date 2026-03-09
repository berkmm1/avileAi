import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');
const { default: JobModel } = await import('../src/models/Job.js');

test('POST /auth/login returns token for valid credentials', async () => {
  const originalFindOne = User.findOne;
  const passwordHash = await bcrypt.hash('demo123', 1);
  User.findOne = async ({ email }) => email === 'demo@example.com'
    ? { _id: 'u1', premium: false, passwordHash }
    : null;

  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'demo@example.com', password: 'demo123' });

  assert.equal(res.status, 200);
  assert.equal(typeof res.body.token, 'string');

  User.findOne = originalFindOne;
});

test('POST /video/create requires auth token', async () => {
  const res = await request(app)
    .post('/video/create')
    .send({ prompt: 'test', params: {} });

  assert.equal(res.status, 401);
});

test('GET /video/list returns only authenticated user jobs', async () => {
  const originalFind = JobModel.find;
  const token = jwt.sign({ id: 'user-1' }, process.env.JWT_SECRET);

  JobModel.find = ({ userId }) => ({
    sort: () => ({
      limit: async () => [{ _id: 'j1', userId, prompt: 'p1', status: 'queued' }]
    })
  });

  const res = await request(app)
    .get('/video/list')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(res.status, 200);
  assert.deepEqual(res.body, [{ _id: 'j1', userId: 'user-1', prompt: 'p1', status: 'queued' }]);

  JobModel.find = originalFind;
});

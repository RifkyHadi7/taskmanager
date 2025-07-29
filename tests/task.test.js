const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Task = require('../src/models/Task');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  await Task.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /tasks', () => {
  it('should create a new task with valid data', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Write Unit Tests',
        description: 'Description of Unit Tests',
        category: 'Development',
        priority: 'High',
        deadline: '2025-08-01T23:59:59.000Z'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Write Unit Tests');
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        description: 'Missing title',
        category: 'Bug',
        priority: 'Medium',
        deadline: '2025-08-01T12:00:00.000Z'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('should return 400 if priority is invalid', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Invalid Priority',
        category: 'Bug',
        priority: 'None',
        deadline: '2025-08-01T12:00:00.000Z'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/priority/i);
  });

  it('should return 400 if deadline is earlier than now', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Invalid Deadline',
        category: 'Bug',
        priority: 'Low',
        deadline: '2025-07-01T12:00:00.000Z'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/deadline/i);
  });
});

describe('GET /tasks', () => {
  it('should return empty array when no tasks', async () => {
    const res = await request(app).get('/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all tasks', async () => {
    await Task.create([
      { title: 'Task 1', category: 'Work', priority: 'High', deadline: new Date() },
      { title: 'Task 2', category: 'Home', priority: 'Medium', deadline: new Date() },
    ]);

    const res = await request(app).get('/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[1]).toHaveProperty('category');
  });

  it('should filter tasks by category', async () => {
    await Task.create([
      { title: 'Task A', category: 'Work', priority: 'Low', deadline: new Date() },
      { title: 'Task B', category: 'Personal', priority: 'High', deadline: new Date() },
    ]);

    const res = await request(app).get('/tasks').query({ category: 'Work' });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('Work');
  });
});


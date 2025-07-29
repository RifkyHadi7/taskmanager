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

  it('should sort tasks by priority', async () => {
    await Task.create([
      { title: 'Task A', category: 'Work', priority: 'High', deadline: new Date() },
      { title: 'Task B', category: 'Personal', priority: 'Medium', deadline: new Date() },
      { title: 'Task B', category: 'Personal', priority: 'Low', deadline: new Date() },
    ]);

    const res = await request(app).get('/tasks').query({ sortBy: 'priority' });

    expect(res.statusCode).toBe(200);
    expect(res.body[0].priority).toBe('Low');
    expect(res.body[2].priority).toBe('High');
  });
});

describe('GET /tasks/:id', () => {
  it('should return task by id', async () => {
    const task = await Task.create({
      title: 'Test Task',
      category: 'Testing',
      priority: 'Medium',
      deadline: new Date(),
    });

    const res = await request(app).get(`/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Test Task');
    expect(res.body).toHaveProperty('_id', task._id.toString());
  });

  it('should return 404 if task not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/tasks/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Task not found');
  });

  it('should return 400 for invalid id format', async () => {
    const res = await request(app).get('/tasks/invalid-id');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid task ID');
  });
});

describe('PUT /tasks/:id', () => {
  let task;
  const futureDate = new Date(Date.now() + 60 * 60 * 1000);

  beforeAll(async () => {
    task = await Task.create({ 
      title: 'Original Title',
      description: 'Original Desc',
      priority: 'Medium',
      deadline: futureDate, });
  });

  afterAll(async () => {
    await Task.deleteMany();
  });

  it('should update the task if valid ID and data are provided', async () => {
    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .send({ title: 'Updated Title', description: 'Updated Desc', priority: "Medium", deadline: futureDate, });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.description).toBe('Updated Desc');
  });

  it('should return 404 if task not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/tasks/${fakeId}`)
      .send({ title: 'Does Not Exist', description: 'Original Desc', priority: "Medium", deadline: futureDate, });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Task not found');
  });

  it('should return 400 if ID is invalid', async () => {
    const res = await request(app)
      .put('/tasks/invalid-id')
      .send({ title: 'Invalid ID', description: 'Original Desc', priority: "Medium", deadline: futureDate, });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid task ID');
  });

  it('should return 400 if body is invalid (Joi error)', async () => {
    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .send({ title: '', description: 123, priority: "Medium", deadline: futureDate, });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('DELETE /tasks/:id', () => {
  let task;

  beforeAll(async () => {
    task = await Task.create({
      title: 'Task to Delete',
      description: 'This task will be deleted',
      priority: 'Low',
      deadline: new Date(Date.now() + 60 * 60 * 1000),
    });
  });

  afterAll(async () => {
    await Task.deleteMany();
  });

  it('should delete task if valid ID is provided', async () => {
    const res = await request(app).delete(`/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Task deleted');

    const deleted = await Task.findById(task._id);
    expect(deleted).toBeNull();
  });

  it('should return 404 if task not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/tasks/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Task not found');
  });

  it('should return 400 if ID is invalid', async () => {
    const res = await request(app).delete('/tasks/invalid-id');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid task ID');
  });
});
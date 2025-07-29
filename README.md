# 📝 Task Manager API

A simple task management REST API built with **Node.js**, **Express**, and **MongoDB**, complete with validation, error handling, and unit testing.

---

## 🚀 Features

- Create, read, update, and delete (CRUD) tasks  
- Input validation with **Joi**  
- Custom error handler middleware  
- Unit testing with **Jest** and **Supertest**  
- Environment configuration with **Docker Compose**

---

## 📦 Tech Stack

- Node.js  
- Express  
- MongoDB with Mongoose  
- Joi (validation)  
- Jest & Supertest (testing)  
- Docker + Docker Compose

---

## 📁 Folder Structure

```
src/
├── controllers/       # Route handlers
├── models/            # Mongoose schemas
├── routes/            # Express routes
├── middleware/        # Error handling & validation middleware
├── validators/        # Joi schemas
└── app.js             # Main Express app
tests/
└── task.test.js       # Unit tests for Task API
docker-compose.yml     # Container setup
.env                   # Environment variables
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-api.git
cd task-api
```

### 2. Setup environment variables

Make file `.env`:

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/taskdb
```

### 3. Run with Docker

```bash
docker-compose up --build
```

Server will run on `http://localhost:5000`

---

## 🧪 Run Tests

```bash
npm install
npm test
```

---

## 📬 API Endpoints

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| POST   | `/tasks`          | Create new task       |
| GET    | `/tasks`          | Get all tasks         |
| GET    | `/tasks/:id`      | Get task by ID        |
| PUT    | `/tasks/:id`      | Update task by ID     |
| DELETE | `/tasks/:id`      | Delete task by ID     |

---

## 🔍 API Documentation

📘 Full Postman API Documentation:  
👉 [View on Postman](https://www.postman.com/codcow/workspace/task-manager/request/34493616-ce9846ef-3998-4f22-a5c0-bd4945f58503?action=share&creator=34493616&ctx=documentation)

---

## 📌 Sample Task JSON

```json
{
  "title": "Finish project",
  "description": "Implement all features",
  "priority": "High",
  "deadline": "2025-08-01T12:00:00.000Z"
}
```

---

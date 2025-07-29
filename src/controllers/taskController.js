const taskService = require('../services/taskService');
const mongoose = require('mongoose');

exports.create = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}

exports.getTasks = async (req, res, next) => {
    try {
        const { category, priority, startDate, endDate, sortBy } = req.query;
        const filters = {};
        const sort = {};

        if (category) filters.category = category;
        if (priority) filters.priority = priority;
        if (startDate || endDate) {
            filters.deadline = {};
            if (startDate) filters.deadline.$gte = new Date(startDate);
            if (endDate) filters.deadline.$lte = new Date(endDate);
        }
        if (sortBy && ['createdAt', 'priority', 'deadline'].includes(sortBy)) sort[sortBy] = 1;

        const tasks = await taskService.getTasks(filters, sort);
        res.json(tasks);
    } catch (err) {
        next(err);
    }
}

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }
        
        const task = await taskService.getTaskById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const task = await taskService.updateTask(id, req.body);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }
        const task = await taskService.deleteTask(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        next(err);
    }
};
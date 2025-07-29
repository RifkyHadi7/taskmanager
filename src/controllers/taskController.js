const taskService = require('../services/taskService');

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
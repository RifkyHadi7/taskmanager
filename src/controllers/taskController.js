const taskService = require('../services/taskService');

exports.create = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}
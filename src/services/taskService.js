const Task = require('../models/Task');

exports.createTask = async (data) => await Task.create(data);

exports.getTasks = async (filters = {}, sort = {}) => {
    const pipeline = [];

    if (Object.keys(filters).length > 0) {
        pipeline.push({ $match: filters });
    }

    if (sort.priority) {
        pipeline.push({
        $addFields: {
            priorityOrder: {
            $switch: {
                branches: [
                { case: { $eq: ['$priority', 'Low'] }, then: 1 },
                { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                { case: { $eq: ['$priority', 'High'] }, then: 3 },
                ],
                default: 4,
            },
            },
        },
        });

        pipeline.push({ $sort: { priorityOrder: 1 } });
    } else if (sort.createdAt || sort.deadline) {
        const field = sort.createdAt ? 'createdAt' : 'deadline';
        pipeline.push({ $sort: { [field]: 1 } });
    }

    if (pipeline.length === 0) {
        return Task.find();
    }

    return Task.aggregate(pipeline);
};
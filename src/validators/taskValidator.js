const Joi = require('joi');

const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').required(),
    deadline: Joi.date().greater('now').required(),
});

module.exports = taskSchema;
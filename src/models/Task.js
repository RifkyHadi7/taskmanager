const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    category: String,
    priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    deadline: { type: Date, required: true },
}, {timestamps: true});

module.exports = mongoose.model('Task', TaskSchema);
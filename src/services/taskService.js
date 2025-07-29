const Task = require('../models/Task');

exports.createTask = async (data) => await Task.create(data);
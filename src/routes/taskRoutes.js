const express = require('express');
const controller = require('../controllers/taskController');
const validate = require('../middleware/validate');
const taskSchema = require('../validators/taskValidator');

const router = express.Router();

router.post('/', validate(taskSchema), controller.create);
router.get('/', controller.getTasks);


module.exports = router;
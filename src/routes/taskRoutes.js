const express = require('express');
const controller = require('../controllers/taskController');
const validate = require('../middleware/validate');
const taskSchema = require('../validators/taskValidator');

const router = express.Router();

router.post('/', validate(taskSchema), controller.create);
router.get('/', controller.getTasks);
router.get('/:id', controller.getById);
router.put('/:id', validate(taskSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
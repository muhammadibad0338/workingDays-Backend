const express = require('express')
const router = express.Router();
const taskController = require('../controllers/task')

router.post('/createTask',taskController.createTask)
router.get('/currentProjectTaks/:id',taskController.getProjectTask)



module.exports = router;
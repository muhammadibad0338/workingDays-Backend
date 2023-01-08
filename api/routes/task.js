const express = require('express')
const router = express.Router();
const taskController = require('../controllers/task')

router.post('/createTask',taskController.createTask)
router.get('/currentProjectTaks/:id',taskController.getProjectTask)
router.put('/updateTaskAgileCycle/:id',taskController.updateTaskAgileCycle)
router.put('/updateTaskDetails/:id',taskController.updateTaskDetails)
router.put('/updateTaskAssginEmployee/:id',taskController.updateTaskAssignEmployee)
router.delete('/deleteTask/:id',taskController.deleteTask)



module.exports = router;
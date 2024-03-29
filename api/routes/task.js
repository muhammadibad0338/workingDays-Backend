const express = require('express')
const router = express.Router();
const taskController = require('../controllers/task')
const taskReportController = require('../controllers/taskReports')

router.post('/createTask', taskController.createTask)
router.get('/currentProjectTask/:id', taskController.getProjectTask)
router.put('/updateTaskAgileCycle/:id', taskController.updateTaskAgileCycle)
router.put('/updateTaskDetails/:id', taskController.updateTaskDetails)
router.put('/updateTaskAssginEmployee/:id', taskController.updateTaskAssignEmployee)
router.put('/addTaskDependency/:id', taskController.addTaskDependency)
router.put('/extedDeadline/:id', taskController.extendDeadline)
router.put('/replaceTaskDependency/:id', taskController.replaceTaskDependency)
router.delete('/deleteTaskDependency/:id', taskController.deleteTaskDependency)
router.delete('/deleteTask/:id', taskController.deleteTask)
router.get('/projectTaskTree/:id', taskController.getProjectTaskTree)

router.get('/projectTasksReports/:projectId', taskController.getProjectTaskReports)

// TaskReport
router.get('/taskReport-taskId/:taskId', taskReportController.getTaskReportByTaskId)
router.get('/taskReports-projectId/:projectId', taskReportController.getTaskReportByTaskId)



module.exports = router;
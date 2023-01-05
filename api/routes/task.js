const express = require('express')
const router = express.Router();
const taskController = require('../controllers/task')

router.post('/createTask',taskController.createTask)




module.exports = router;
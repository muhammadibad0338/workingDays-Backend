const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

router.get('/userProjects/:id', projectController.userProjects)
router.post('/',projectController.createProject)
router.get('/projectDetails/:id',projectController.projectDetails)

module.exports = router;
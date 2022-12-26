const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

router.get('/allProjects', projectController.allProjects)
router.post('/',projectController.createProject)


module.exports = router;
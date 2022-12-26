const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

router.get('/userProjects/:id', projectController.userProjects)
router.post('/',projectController.createProject)


module.exports = router;
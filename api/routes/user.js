const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.registerUser)
router.post('/login', userController.login)
router.get('/currentUserDetails/:id', userController.userDetails)
router.get('/searchUser/:key', userController.searchUser)
router.put('/changeDesignation/', userController.changeJobDesignation)

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup',userController.registerUser)
router.post('/login',userController.login)
router.get('/currentUserDetails/:id',userController.userDetails)


module.exports = router;
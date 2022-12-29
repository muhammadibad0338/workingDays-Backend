const express = require('express')
const router = express.Router();
const requestController = require('../controllers/request')

router.post('/sendRequest',requestController.sendRequest)


module.exports = router;
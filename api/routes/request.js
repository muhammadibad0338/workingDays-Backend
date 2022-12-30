const express = require('express')
const router = express.Router();
const requestController = require('../controllers/request')

router.post('/sendRequest',requestController.sendRequest)
router.get('/userRequest/:id',requestController.getUserRequests)
router.put('/changeRequestStatus/:id',requestController.updateRequestStatus)


module.exports = router;
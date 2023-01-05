const mongoose = require('mongoose')
const Team = require('../models/team')
const User = require('../models/user')


exports.createTask = async (req, res, next) => {
    try {
        res.send('okay')
    }
    catch (err) {
        res.status(200).json({
            message: 'REquest Failed',
            error:er
        })
    }
}
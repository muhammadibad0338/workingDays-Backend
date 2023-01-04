const mongoose = require('mongoose')
const Team = require('../models/team')
const User = require('../models/user')


exports.userTeam = async (req, res, next) => {
    try {
        const userId = req.params.id
        // console.log(userId,"userID")
        Team.findOne({ teamMembers: { $in: userId } }).populate('teamMembers').populate('teamOwner').exec((err, docs) => {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.status(200).json({
                    team: docs
                })
            }
        })


    }
    catch (err) {
        res.status(500).json({
            message: 'Request Fail',
            error: err
        })
    }
}

exports.searchUserInTeam = async = (req, res, next) => {
    try {
        const key = req.params.key;
        const softwareCompany = req.body.softwareCompany

        User.find({ $and: [{ joinedSoftwareCompany: softwareCompany }, { role: "Employee" }, { $or: [{ name: { $regex: key, $options: 'i' } }, { email: { $regex: key, $options: 'i' } }] }] }, (error, users) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send(users);
            }
        });


    } catch (err) {
        res.status(500).json({
            message: 'Search Request Fail',
            error: err
        })
    }
}
const mongoose= require('mongoose')
const Team = require('../models/team')


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

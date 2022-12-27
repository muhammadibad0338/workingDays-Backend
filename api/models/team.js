const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: false,

    },
    teamMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // require: true
        }
    ],
    teamOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }

}, { timestamps: true })


module.exports = mongoose.model('Team', teamSchema)
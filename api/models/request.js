const mongoose = require('mongoose');



const requestSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    softwareCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    staus: {
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Request', requestSchema)
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
    status: {
        type: String,
        require: true
    },
    jobDescription: [
        {
            title: { type: String, required: false },
            AppointedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
            startDate: { type: Date, required: false },
            endDate: { type: Date, required: false },
            level: { type: Number, required: false }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('Request', requestSchema)
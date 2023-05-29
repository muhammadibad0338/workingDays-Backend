const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    agileCycle: {
        type: String,
        require: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: false
    },
    softwareCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    deadlineStart: {
        type: Date,
        require: false
    },
    deadlineEnd: {
        type: Date,
        require: false
    },
    deadlineExtend: {
        type: Date,
        require: false,
        // default: new Date(0),
    },
    dependUpon: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
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
        // require: true,
        // validate: function (value) {
        //     return value >= new Date()
        // }
    },
    deadlineEnd: {
        type: Date,
        require: false
        // require: true,
        // validate: function (value) {
        //     return value > this.deadlineStart;
        // },
    },
    deadlineExtend: {
        type: Date,
        require: false,
        // default: new Date(0),
    },
    createdBy :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
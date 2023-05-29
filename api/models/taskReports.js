const mongoose = require('mongoose');

const taskUpdateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    agileCycle: {
        type: String,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    deadlineStart: {
        type: Date,
        required: false
    },
    deadlineEnd: {
        type: Date,
        required: false
    },
    deadlineExtend: {
        type: Date,
        required: false,
        // default: new Date(0),
    },
    dependUpon: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    isCompleted: {
        type: Boolean,
    }
}, { timestamps: true });

const taskReportSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    updates: [taskUpdateSchema],
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
}, { timestamps: true });

module.exports = mongoose.model('TaskReport', taskReportSchema);

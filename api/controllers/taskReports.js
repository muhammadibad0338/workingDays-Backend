const mongoose = require('mongoose')
const Team = require('../models/team')
const User = require('../models/user')
const Project = require('../models/project')
const Task = require('../models/task')
const TaskReport = require('../models/taskReports')


exports.getTaskReportByTaskId = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const taskReport = await TaskReport.findOne({ taskId });

        if (!taskReport) {
            return res.status(404).json({
                status: false,
                error: 'Task report not found'
            });
        }

        res.status(200).json({
            status: true,
            taskReport
        });

    } catch (error) {
        console.error('Error retrieving task report:', error);
        res.status(500).json({
            status: false,
            error: 'Failed to retrieve task report'
        });
    }
}


exports.getTaskReportsByProject = async (req, res) => {
    try {

        const { projectId } = req.params;

        const taskReports = await TaskReport.find({ project: projectId });

        if (taskReports.length === 0) {
            return res.status(404).json({
                status: false,
                error: 'No task reports found for the project'
            });
        }

        res.status(200).json({
            status: true,
            taskReports
        });

    } catch (error) {
        console.error('Error retrieving task reports:', error);
        res.status(500).json({
            status: false,
            error: 'Failed to retrieve task reports'
        });
    }
};
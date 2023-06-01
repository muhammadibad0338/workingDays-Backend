const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const Task = require('../models/task')
const Project = require('../models/project')
const TaskReport = require('../models/taskReports')


const createTaskReport = async ({ taskId, updates, project }) => {
    try {

        const taskReport = new TaskReport({
            taskId: taskId,
            updates: updates,
            project: project
        });

        const newTaskReport = await taskReport.save();

        return {
            status: true,
            taskReport: newTaskReport
        }
    }
    catch (error) {
        return {
            status: false,
            message: error
        };
    }
}


const updateTaskReport = async ({taskId, updateTaskCredentials}) => {
    try {
        // console.log(taskId, updateTaskCredentials,"updateTaskCredentials")
        const taskReport = await TaskReport.findOne({ taskId });

        if (!taskReport) {
            return {
                status: false,
                message: 'Task report not found'
            }
        }

        const update = {
            ...updateTaskCredentials
        };

        taskReport.updates.push(update);

        const updatedTaskReport = await taskReport.save();

        return {
            status: true,
            taskReport: updatedTaskReport
        }
    }
    catch (error) {
        console.log(error,"updateTaskReport error")
        return {
            status: false,
            message: error
        };
    }
}



module.exports = {
    createTaskReport,
    updateTaskReport
}
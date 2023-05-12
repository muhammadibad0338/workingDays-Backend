const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const Task = require('../models/task')
const Project = require('../models/project')



const sendTaskCreateEmail = async ({ email, username, projectId }) => {
    try {
        // console.log({ email, username, projectId },'sendTaskCreateEmail')
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'workingdays.wd@gmail.com',
                // pass: 'workingdays0338'
                pass: "dbwdpegvwfspjeoz"
            }
        });


        await transporter.sendMail({
            from: "workingdays.wd@gmail.com",
            to: email,
            subject: `Working Days Task Assigned `,
            html: `<h1>Hi ${username},</h1>` +
                `<a href="http://localhost:3000/project/${projectId}"  >${username} you have been assigned a new Task </a>`
        })
        return true
    } catch (error) {
        console.log(error, "sendTaskCreateEmail")
        return false
    }
}


const areTasksInSameProject = async (taskRefs) => {
    try {
        const projectIds = new Set();
        for (const taskRef of taskRefs) {
            const task = await Task.findById(taskRef).populate('project');
            projectIds.add(task.project._id.toString());
        }
        return projectIds.size === 1;
    }
    catch (error) {
        console.log(error, "areTasksInSameProject")
        return false
    }
}


const checkDependUpon = async (taskId, dependUponIds) => {
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            // console.log('Task not found');
            return {
                status: false,
                message: 'Task not found'
            };
        }
        const project = await Project.findById(task.project);
        if (!project) {
            // console.log('Project not found');
            // return false;
            return {
                status: false,
                message: 'Project not found'
            };
        }
        for (let i = 0; i < dependUponIds.length; i++) {
            const dependUpon = await Task.findById(dependUponIds[i]);
            if (!dependUpon) {
                // console.log(`Task with ID ${dependUponIds[i]} not found`);
                // return false;
                return {
                    status: false,
                    message: `Task with ID ${dependUponIds[i]} not found`
                };
            }
            if (dependUpon.project.toString() !== project._id.toString()) {
                // console.log(`Task with ID ${dependUponIds[i]} does not belong to the same project as the current task`);
                // return false;
                return {
                    status: false,
                    message: `Task with ID ${dependUponIds[i]} does not belong to the same project as the current task`
                };
            }
            if (dependUpon._id.toString() === taskId.toString()) {
                // console.log('Task cannot depend upon itself');
                // return false;
                return {
                    status: false,
                    message: 'Task cannot depend upon itself'
                };
            }

            // Code Start to tackle Circular Dependency
            if (dependUpon.dependUpon.includes(taskId)) {
                return {
                    status: false,
                    message: 'Circular dependency detected'
                };
            }
            const dependUponOfDependUponTask = await Task.findById(dependUpon._id);
            if (dependUponOfDependUponTask.dependUpon.includes(dependUpon._id)) {
                return {
                    status: false,
                    message: 'Circular dependency detected'
                };
            }
            // Code End to tackle Circular Dependency
        }
        // console.log('All tasks belong to the same project and are not the same as the current task');
        // return true;
        return {
            status: true,
            message: 'All tasks belong to the same project and are not the same as the current task'
        };
    }
    catch (error) {
        // console.log(error, "checkDependUpon")
        // return false
        return {
            status: false,
            message: error
        };
    }
}

module.exports = {
    sendTaskCreateEmail,
    areTasksInSameProject,
    checkDependUpon
}
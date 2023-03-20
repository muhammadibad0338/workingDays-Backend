const mongoose = require('mongoose')
const Team = require('../models/team')
const User = require('../models/user')
const Project = require('../models/project')
const Task = require('../models/task')

const { sendTaskCreateEmail } = require("../utilities/TaksUtils")

exports.createTask = async (req, res, next) => {
    try {
        const employeeId = req.body.employee;
        const softwareCompanyId = req.body.softwareCompany
        const projectId = req.body.project
        const now = new Date();

        const softwareCompany = await User.findById(softwareCompanyId)


        if (softwareCompany.role === "softwareCompany") {

            if (employeeId) {
                //create task with assigning it to employee
                const taskAssigner = await User.findById(employeeId)
                const isProjectMember = await Project.find({ $and: [{ _id: projectId }, { projectTeam: { $in: [employeeId] } }] })
                if (isProjectMember.length > 0) {

                    const createTask = new Task({
                        _id: new mongoose.Types.ObjectId,
                        name: req.body.name,
                        description: req.body.description,
                        agileCycle: req.body.agileCycle,
                        employee: employeeId,
                        softwareCompany: softwareCompanyId,
                        project: projectId,
                        deadlineStart: req.body.deadlineStart,
                        deadlineEnd: req.body.deadlineEnd
                        // deadlineStart: new Date(now.setDate(now.getDate() + 1)),
                        // deadlineEnd: new Date(now.setDate(now.getDate() + 2)),
                    })
                    let username = taskAssigner.name
                    let email = taskAssigner.email
                    let isEmailSent = await sendTaskCreateEmail({ email, username, projectId })
                    if (!isEmailSent) {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to send email."
                        })
                    }

                    createTask.save().then(result => {
                        res.status(200).json({
                            message: 'Task Created Sucessfully',
                            Task: result
                        })
                    }).catch(err => {
                        res.status(500).json({
                            message: 'Request Fail',
                            error: err
                        })
                    })

                }
                else {
                    res.status(500).json({
                        message: 'User is not in you Project Team'
                    })
                }
            }
            else {
                //create taks without assigning them to anyone
                const createTaskWithoutAssigning = new Task({
                    _id: new mongoose.Types.ObjectId,
                    name: req.body.name,
                    description: req.body.description,
                    agileCycle: req.body.agileCycle,
                    softwareCompany: softwareCompanyId,
                    project: projectId,
                    deadlineStart: new Date(now.setDate(now.getDate() + 1)),
                    deadlineEnd: new Date(now.setDate(now.getDate() + 2)),
                })

                createTaskWithoutAssigning.save().then(result => {
                    res.status(200).json({
                        message: 'Task Created Sucessfully',
                        Task: result
                    })
                }).catch(err => {
                    res.status(500).json({
                        message: 'Request Fail',
                        error: err
                    })
                })
            }
        }
        else {
            return res.status(500).send({
                message: 'User are not permit to perfome Create Task Action'
            })
        }

    }
    catch (err) {
        res.status(500).json({
            message: 'REquest Failed',
            error: err
        })
    }
}






exports.getProjectTask = async (req, res, next) => {
    try {
        id = req.params.id

        const tasks = await Task.find({ project: id }).populate('employee').populate('softwareCompany')

        if (!tasks) {
            res.status(404).send({
                message: 'Tasks Not Found',
            })
        }
        else {
            res.status(200).json({
                tasks: tasks
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'Request Failed',
            error: err
        })
    }
}





exports.updateTaskAgileCycle = async (req, res, next) => {
    try {
        const id = req.params.id;
        const agileCycle = req.body.agileCycle

        // const taskDetails = await Task.find({ _id: id, $or: [{ employee: req.body.employee }, { softwareCompany: req.body.employee }] })

        // if (taskDetails.length > 0) {
        Task.findByIdAndUpdate(
            id, {
            agileCycle: agileCycle
        },
            {
                new: true
            }, (taskUpdateErr, taskUpdateRes) => {
                if (taskUpdateErr) {
                    res.status(500).json({
                        message: 'Request Failed',
                        error: taskUpdateErr
                    })
                }
                else {
                    res.status(200).json({
                        message: `Task Status changed to ${agileCycle}`,
                        task: taskUpdateRes
                    })
                }
            }
        )
        // }
        // else {
        //     res.status(500).json({
        //         message: `User are not permit to perfome such Action`
        //     })
        // }
    }
    catch (err) {
        res.status(500).json({
            message: 'Request Failed',
            error: err
        })
    }
}


exports.updateTaskDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const description = req.body.description

        const taskDetails = await Task.find({ _id: id, softwareCompany: req.body.softwareCompany })

        if (taskDetails.length > 0) {
            Task.findByIdAndUpdate(
                id, {
                name: name,
                description: description
            },
                {
                    new: true
                }, (taskUpdateErr, taskUpdateRes) => {
                    if (taskUpdateErr) {
                        res.status(500).json({
                            message: 'Request Failed',
                            error: taskUpdateErr
                        })
                    }
                    else {
                        res.status(200).json({
                            message: `Task updated`,
                            task: taskUpdateRes
                        })
                    }
                }
            )
        }
        else {
            res.status(500).json({
                message: `User are not permit to perfome such Action`
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'Request Failed',
            error: err
        })
    }
}

exports.updateTaskAssignEmployee = async (req, res, next) => {
    try {
        const id = req.params.id;
        const employeeId = req.body.employee;
        const softwareCompanyId = req.body.softwareCompany
        const projectId = req.body.project

        const taskDetails = await Task.find({ _id: id, softwareCompany: softwareCompanyId })

        if (taskDetails.length > 0) {
            const isProjectMember = await Project.find({ $and: [{ _id: projectId }, { projectTeam: { $in: [employeeId] } }] })

            if (isProjectMember.length > 0) {

                Task.findByIdAndUpdate(
                    id, {
                    employee: employeeId
                },
                    {
                        new: true
                    }, (taskUpdateErr, taskUpdateRes) => {
                        if (taskUpdateErr) {
                            res.status(500).json({
                                message: 'Request Failed',
                                error: taskUpdateErr
                            })
                        }
                        else {
                            res.status(200).json({
                                message: `Task Assign updated`,
                                task: taskUpdateRes
                            })
                        }
                    }
                )

            }
            else {
                res.status(500).json({
                    message: 'User is not in you Project Team'
                })
            }


        }
        else {
            res.status(500).json({
                message: `User are not permit to perfome such Action`
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'Request Failed',
            error: err
        })
    }
}

exports.deleteTask = async (req, res, next) => {
    try {

        Task.findByIdAndRemove(req.params.id).then(task => {
            if (task) {
                return res.status(200).json({
                    success: true,
                    message: 'task deleted successfully'
                })
            } else {
                return res.status(404).json({ success: false, message: "task not found" })
            }
        })
            .catch(err => {
                return res.status(400).json({ success: false, error: err })
            })
    }
    catch (err) {
        res.status(500).json({
            message: 'Request Failed',
            error: err
        })
    }
}
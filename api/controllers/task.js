const mongoose = require('mongoose')
const Team = require('../models/team')
const User = require('../models/user')
const Project = require('../models/project')
const Task = require('../models/task')

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
                        deadlineStart: new Date(now.setDate(now.getDate() + 1)),
                        deadlineEnd: new Date(now.setDate(now.getDate() + 2)),
                    })

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

        const tasks = await Task.find({ project: id })

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

        const taskDetails = await Task.find({ _id: id , employee:req.body.employee })
        
        if (taskDetails.length > 0) {
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
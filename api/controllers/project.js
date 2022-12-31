const mongoose = require('mongoose');
const Project = require('../models/project')
const User = require('../models/user')
const Team = require('../models/team')

exports.userProjects = async (req, res, next) => {
    try {
        const userId = req.params.id
        // console.log(userId,"userID")
        Project.find({ projectTeam: { $in: userId } }).populate('projectTeam').exec((err, docs) => {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.status(200).json({
                    projects: docs
                })
            }
        })


    }
    catch (err) {
        res.status(500).json({
            message: 'Request Fail',
            error: err
        })
    }
}

exports.createProject = async (req, res, next) => {
    try {
        let userId = req.body.user._id
        // console.log(user,"user")
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).send({
                message: 'User Not Found'
            })
        }
        else {
            if (user.role === "employee") {
                res.status(500).send({
                    message: "Only Software Company can create Project"
                })
            }
            else {
                const createProject = new Project({
                    _id: new mongoose.Types.ObjectId,
                    name: req.body.name,
                    description: req.body.description,
                    icon: req.body.icon,
                    projectTeam: [userId],
                    projectOwner: req.body.user
                })
                createProject.save()
                    .then(result => {
                        res.status(200).json({
                            message: 'Project Created Sucessfully',
                            project: result
                        })
                    }).catch(err => {
                        res.status(500).json({
                            message: 'Request Fail',
                            error: err
                        })
                    })
            }
        }





    }
    catch (err) {
        res.status(500).json({
            message: 'Something Went Wrong while creating project',
            err
        })
    }
}

exports.projectDetails = async (req, res, next) => {
    try {
        const userId = req.params.id
        const project = await Project.findById(userId).populate('projectTeam').exec()

        if (!project) {
            res.status(404).send({
                message: 'Project Not Found'
            })
        }
        else {
            res.status(200).json({
                project: project
            })
        }
    }
    catch (err) {
        res.status(200).json({
            message: 'Request Failed',
            error: err
        })
    }
}

exports.addMemberToProject = async (req, res, next) => {
    try {
        const projectId = req.body.projectId
        const userId = req.body.id
        const softwareCompany = req.body.softwareCompany

        const isTeamMember = await Team.findOne({ $and: [{ teamOwner: softwareCompany }, { teamMembers: { $in: [userId] } }] })

        if (isTeamMember) {
            const isProjectMember = await Project.find({ $and: [{ _id: projectId }, { projectTeam: { $in: [userId] } }] })

            if (isProjectMember.length > 0) {
                res.status(500).json({
                    message: `Employee is Already in ${isProjectMember[0]?.name}  Project`,
                    // isProjectMember
                })
            }
            else {
                Project.findByIdAndUpdate(
                    projectId, {
                    $push: { projectTeam: userId }
                },
                    {
                        new: true
                    }, (err, projectUpdateRes) => {
                        if (err) {
                            res.status(500).json({
                                message: 'Request Failed',
                                error: err
                            })
                        }
                        else {
                            res.status(200).json({
                                message: 'Employee Added to Project',
                                project: projectUpdateRes
                            })
                        }
                    }
                )
            }
        }
        else {
            res.status(500).json({
                message: 'User is not in your Software Company'
            })
        }



    }
    catch (err) {
        res.status(500).json({
            message: 'Auth Failed',
            error: err
        })
    }
}
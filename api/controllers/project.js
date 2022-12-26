const mongoose = require('mongoose');
const Project = require('../models/project')
const User = require('../models/user')

exports.allProjects = async (req, res, next) => {
    try {
        // const userId = req.params.id
        res.status(200).json({
            name: "Muhammad Ibad"
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
                    employees: [],
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
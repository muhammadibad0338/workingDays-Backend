const mongoose = require('mongoose');
const User = require('../models/user')
const Team = require('../models/team')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = (req, res, next) => {
    try {
        const secret = process.env.secret;
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return res.status(400).json({
                        message: 'UserName Already is Use',
                    })
                }
                else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(400).json({
                                message: 'Request Fail',
                                error: err
                            })
                        }
                        else {
                            const createUser = new User({
                                _id: new mongoose.Types.ObjectId,
                                name: req.body.name,
                                email: req.body.email,
                                password: hash,
                                phoneNumber: req.body.phoneNumber,
                                role: req.body.role,
                                description: req.body.description,
                                level: req.body.role === "softwareCompany" ? 0 : null
                            })

                            createUser.save()
                                .then(async (result) => {
                                    if (result.role === "softwareCompany") {
                                        const createTeam = new Team({
                                            _id: new mongoose.Types.ObjectId,
                                            name: req.body.name,
                                            email: req.body.email,
                                            teamMembers: [result._id],
                                            teamOwner: result
                                        })
                                        const team = await createTeam.save()
                                    }
                                    const token = jwt.sign(
                                        {
                                            email: req.body.email,
                                            password: req.body.password
                                        },
                                        secret,
                                        {
                                            expiresIn: '1d'
                                        }
                                    )
                                    res.status(200).json({
                                        message: 'User Created Sucessfully',
                                        token: token,
                                        user: result
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        message: 'Request Fail',
                                        error: err
                                    })
                                })
                        }
                    })
                }
            })
    }
    catch (error) {
        res.status(500).json({
            message: 'Request Fail',
            error: error
        })
    }
}

exports.login = (req, res, next) => {
    try {
        const secret = process.env.secret

        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length < 1) {
                    return res.status(401).json({
                        message: 'User not found'
                    })
                }
                else {
                    bcrypt.compare(req.body.password, user[0].password, async (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Auth Failed'
                            })
                        }
                        if (result) {
                            const token = jwt.sign(
                                {
                                    email: req.body.email,
                                    password: req.body.password
                                },
                                secret,
                                {
                                    expiresIn: '1d'
                                }
                            )
                            const data = await User.findOne({ email: req.body.email })
                            return res.status(200).json({
                                message: 'User Login Sucessfully',
                                token: token,
                                user: data
                            })
                        }
                        res.status(401).json({
                            message: 'Auth Failed'
                        })
                    })
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    }
    catch (err) {
        res.status(500).json({
            message: 'Request Fail',
            error: err
        })
    }
}

exports.userDetails = async (req, res, next) => {
    try {
        // console.log(req.params.id, "id")
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send({
                message: 'user Not Found'
            })
        }
        res.status('200').json({
            message: 'User Found',
            user
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'Request Fail',
            error: err
        })
    }
}

exports.searchUser = async = (req, res, next) => {
    try {
        const key = req.params.key;

        User.find({ $or: [{ name: { $regex: key, $options: 'i' } }, { email: { $regex: key, $options: 'i' } }] }, (error, users) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send(users);
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Search Request Fail',
            error: err
        })
    }
}


exports.changeJobDesignation = async (req, res, next) => {
    try {
        const level = req.body.level;
        const employee = req.body.employee;
        const employeer = req.body.employeer
        const title = req.body.title
        joinedSoftwareCompany = req.body.joinedSoftwareCompany


        console.log(req.body, "reqBody")
        const now = new Date();

        let jobTitleByLevel = {
            '1': 'executive',
            '2': 'manager',
            '3': 'teamLead',
            '4': 'juniorDeveloper',
            '5': 'intern'
        }

        let newJobDescription = {
            title: title,
            AppointedBy: employeer,
            company: joinedSoftwareCompany,
            startDate: now,
            level: level
        }


        const team = await Team.findOne({ teamMembers: { $all: [employee, employeer] } });
        // return !!team

        if (!!team) {

            const employeeLevel = await User.findOne({ _id: employee }).select('level');
            const employeerLevel = await User.findOne({ _id: employeer }).select('level');

            if (level === 0) {
                res.status(200).json({
                    status: true,
                    message: 'Company is alreday Registered'
                })
            }
            if (![0, 1, 2].includes(employeerLevel.level)) {
                res.status(200).json({
                    status: true,
                    message: 'Permission Denied '
                })
            }
            if (employeerLevel.level >= employeeLevel.level) {
                res.status(200).json({
                    status: true,
                    message: 'Permission Denied '
                })
            }


            User.findByIdAndUpdate(
                employee, {
                // joinedSoftwareCompany: company,
                $push: { jobDescription: newJobDescription },
                level: level
            },
                {
                    new: true
                }, (userUpdateErr, userUpdateRes) => {
                    if (userUpdateErr) {
                        res.status(500).json({
                            message: 'Request Failed',
                            error: userUpdateErr
                        })
                    }
                    else {
                        res.status(200).json({
                            message: 'Designation Changed',
                            employee: userUpdateRes,
                        })
                    }
                }
            )


            // res.status(200).json({
            //     status: true,
            //     message: 'on the Same Team',
            //     employeeLevel: employeeLevel.level,
            //     employeerLevel: !!employeerLevel.level
            // })
        }
        else {
            res.status(200).json({
                status: true,
                message: 'Not on the Same Team'
            })
        }


    } catch (err) {
        console.log(err, "changeJobDesignation error")
        res.status(500).json({
            status: false,
            message: 'Search Request Fail',
            error: err
        })
    }
}
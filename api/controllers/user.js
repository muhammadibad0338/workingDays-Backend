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
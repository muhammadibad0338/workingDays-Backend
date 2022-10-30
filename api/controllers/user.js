const mongoose = require('mongoose');
const User = require('../models/user')
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
                                message: 'Request Fail Hash',
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
                                .then(result => {
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


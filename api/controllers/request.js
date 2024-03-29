const mongoose = require('mongoose');
const Request = require('../models/request');
const User = require('../models/user')
const Team = require('../models/team')

exports.sendRequest = async (req, res, next) => {
    try {
        const employeeId = req.body.employee;
        const softwareCompanyId = req.body.softwareCompany

        const employee = await User.findById(employeeId)
        const softwareCompany = await User.findById(softwareCompanyId)
        const isAlreadyRequestExists = await Request.find({ $and: [{ employee: employeeId }, { softwareCompany: softwareCompanyId }, { status: "Pending" }] })
        const isAlreadyInAnotherTeam = await Team.find({ teamMembers: { $in: employeeId } })

        const now = new Date();

        if (employee.role !== "Employee" || ![0, 1, 2].includes(softwareCompany.level)) {
            return res.status(500).send({
                message: 'User are not permit to perfome send Request Action'
            })
        }
        else if (isAlreadyRequestExists.length > 0) {
            return res.status(500).send({
                message: 'request has already send'
            })
        }
        else if (isAlreadyInAnotherTeam.length > 0) {
            return res.status(500).send({
                message: 'User is already in Another Team'
            })
        }
        else {

            const newJobDescription = {
                title: req.body.title,
                AppointedBy: req.body.AppointedBy,
                startDate: now,
                level: req.body.level,
                company: req.body.company
            };

            const createRequest = new Request({
                _id: new mongoose.Types.ObjectId,
                employee: employeeId,
                softwareCompany: softwareCompanyId,
                status: 'Pending',
                jobDescription: [newJobDescription]
            })

            createRequest.save().then(result => {
                res.status(200).json({
                    message: 'Request send Sucessfully',
                    request: result
                })
            }).catch(err => {
                res.status(500).json({
                    message: 'Request Fail',
                    error: err
                })
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'REquest Fail',
            error: err
        })
    }
}


exports.getUserRequests = async (req, res, next) => {
    try {
        const userId = req.params.id
        Request.find({ $or: [{ employee: userId }, { softwareCompany: userId }] }).populate('employee').populate('softwareCompany')
            .exec()
            .then((requests) => {
                if (requests.length < 1) {
                    res.status(401).json({
                        message: 'Request not Found',
                        // requests: []

                    })
                }
                else {
                    res.status(200).json({
                        requests: requests
                    })
                }
            })
    }
    catch (err) {
        res.status(200).json({
            message: 'Request Failed',
            error: err
        })
    }
}

exports.updateRequestStatus = async (req, res, next) => {
    try {
        const userId = req.body.employee
        const requestId = req.params.id
        const requestStatus = req.body.status
        const softwareCompany = req.body.softwareCompany

        const employee = await User.findById(userId)

        if (employee.role !== "Employee") {
            return res.status(500).send({
                message: 'User are not permit to perfome such Request Action'
            })
        }
        else {
            if (requestStatus.toLowerCase() === "accepted") {
                Team.find({ teamMembers: { $in: userId } }).populate('teamMembers').exec(async (err, docs) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    else {
                        // console.log(docs, "docs")
                        if (docs.length > 0) {
                            return res.status(500).send({
                                message: 'User is Already in another Team'
                            })
                        }
                        else {


                            Request.findByIdAndUpdate(
                                requestId, {
                                status: requestStatus
                            },
                                {
                                    new: true
                                },
                                (err, requestRes) => {
                                    if (err) {
                                        // console.log(err);
                                        res.status(500).json({
                                            message: 'Request Failed',
                                            error: err
                                        })
                                    } else {
                                        Team.updateOne({ teamOwner: softwareCompany }, { $push: { teamMembers: userId } }, (teamErr, teamRes) => {
                                            if (teamErr) {
                                                res.status(500).json({
                                                    message: 'Request Failed',
                                                    error: teamErr
                                                })
                                            }
                                            else {
                                                console.log(requestRes, "requestRes")

                                                User.findByIdAndUpdate(
                                                    userId, {
                                                    joinedSoftwareCompany: softwareCompany,
                                                    $push: { jobDescription: requestRes.jobDescription[0] },
                                                    level: requestRes.jobDescription[0].level
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
                                                                message: 'Request Accepted',
                                                                request: requestRes,
                                                                team: teamRes
                                                            })
                                                        }
                                                    }
                                                )

                                            }
                                        })

                                    }
                                }
                            )

                        }
                    }
                })

            }
            else if (requestStatus.toLowerCase() === "rejected") {
                Request.findByIdAndUpdate(
                    requestId, {
                    status: requestStatus
                },
                    {
                        new: true
                    },
                    (err, requestRes) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                message: 'Request Failed',
                                error: err
                            })
                        } else {
                            res.status(200).json({
                                message: 'Request Rejected',
                                request: requestRes,
                            })

                        }
                    }
                )

            }
            else {
                res.status(500).send({
                    message: 'Request Status not Correct'
                })
            }
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'Request Failed',
            error: err
        })
    }
}
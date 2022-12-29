const mongoose = require('mongoose');
const Request = require('../models/request');
const User = require('../models/user')

exports.sendRequest = async (req, res, next) => {
    try {
        const employeeId = req.body.employee;
        const softwareCompanyId = req.body.softwareCompany

        const employee = await User.findById(employeeId)
        const softwareCompany = await User.findById(softwareCompanyId)
        const isAlreadyRequestExists = await Request.find({ $and: [{ employee: employeeId }, { softwareCompany: softwareCompanyId }] })

        if (employee.role !== "Employee" || softwareCompany.role !== "softwareCompany") {
            return res.status(500).send({
                message: 'User are not permit to perfome send Request Action'
            })
        }
        else if (isAlreadyRequestExists.length > 0) {
            return res.status(500).send({
                message: 'request has already send'
            })
        }
        else {


            const createRequest = new Request({
                _id: new mongoose.Types.ObjectId,
                employee: employeeId,
                softwareCompany: softwareCompanyId,
                staus: 'Pending'
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
        Request.find({ $or: [{ employee: userId }, { softwareCompany: userId }] })
            .exec()
            .then((requests) => {
                if (requests.length < 1) {
                    res.status(401).json({
                        message: 'Request not Found'
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

// exports.updateRequestStatus = async (req, res, next) => {
//     try {
//         const userId = req.body.userId
//         const requestId = req.body.requestId
//         const requestStatus = req.body.status

//         const employee = await User.findById(userId)

//         if (employee.role !== "Employee") {
//             return res.status(500).send({
//                 message: 'User are not permit to perfome such Request Action'
//             })
//         }
//         else {
//             if (requestStatus.toLowerCase() === "accepted") {

//             }
//         }


//     }
//     catch (err) {
//         res.status(200).json({
//             message: 'Request Failed',
//             error: err
//         })
//     }
// }
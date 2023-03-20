const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs");



const sendTaskCreateEmail = async ({ email, username, projectId }) => {
    try {
        // console.log({ email, username, projectId },'sendTaskCreateEmail')
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'workingdays.wd@gmail.com',
                // pass: 'workingdays0338'
                pass:"dbwdpegvwfspjeoz"
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
        console.log(error)
        return false
    }
}


module.exports = {
    sendTaskCreateEmail
}
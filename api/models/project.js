const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: false,

    },
    icon:{
        type:String,
        require: true
    },
    // employees: {
    //     type: Array,
    //     default: []
    // },
    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // require: true
        }
    ],
    projectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }

}, { timestamps: true })


module.exports = mongoose.model('Project', projectSchema)
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //==== email regex =====
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    description:{
        type: String,
        reduired: false
    },
    profilePicture: {
        type: String,
        default:'https://firebasestorage.googleapis.com/v0/b/facebook-clone-40392.appspot.com/o/images%2FpersonIcon.png?alt=media&token=d7a62fe5-83a5-4934-8c06-a6fa97223f49'
    },
    joinedSoftwareCompany:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:false
    }
    // projects:{
    //     type: Array,
    //     default:[],
    //     required:false
    // }
    
}, { timestamps: true })

module.exports = mongoose.model('User',userSchema)
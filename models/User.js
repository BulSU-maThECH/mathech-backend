const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name required']
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: [true, 'Last name required']
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Mobile number required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    active_logins: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: mongoose.Schema.Types.ObjectId,
            },
            ipAddr: {
                type: String,
                required: [true, 'IP address required'],
            },
            browser: {
                type: String,
            },
            os: {
                type: String,
            },
            platform: {
                type: String,
            },
            source: {
                type: String,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: false, versionKey: false }));
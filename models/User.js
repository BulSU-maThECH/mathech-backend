const mongoose = require('mongoose');

/**
 * The exported Mongoose model for the 'User' schema. This schema defines the structure of user data
 * including full name, email, mobile number, password, and account activation status.
 * 
 * @model User
 * 
 * @param {Object} fullName - Object containing first name, middle name (optional), and last name.
 * @param {String} email - User's email address.
 * @param {String} mobileNumber - User's mobile number.
 * @param {String} password - User's hashed password.
 * @param {Boolean} isActive - Indicates whether the user account is active or not (default: true).
 */
module.exports = mongoose.model('User', new mongoose.Schema({
    fullName: {
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
        }
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: false, versionKey: false }));
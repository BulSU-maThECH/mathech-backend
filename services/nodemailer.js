const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * The `transporter` is an instance of Nodemailer's transport object, configured to send emails using
 * the Gmail service. It is created with the provided Gmail client username and password stored in
 * environment variables.
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_GMAIL_CLIENT_USERNAME,
        pass: process.env.GOOGLE_GMAIL_CLIENT_PASSWORD
    }
});

module.exports = { transporter };
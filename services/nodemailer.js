const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_GMAIL_CLIENT_USERNAME,
        pass: process.env.GOOGLE_GMAIL_CLIENT_PASSWORD
    }
});

module.exports = { transporter };
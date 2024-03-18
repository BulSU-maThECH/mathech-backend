const express = require('express');
const router = express.Router();
const { sendOtp } = require('../controllers/otpController');

router.route('/send').post(sendOtp);

module.exports = router;
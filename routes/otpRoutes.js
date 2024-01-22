const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

router.post('/send', (req, res) => {
    otpController.sendOtp(req.body).then(resultFromController => res.send(resultFromController));
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/Authentication');
const { CreateSet } = require('../controllers/quizSetController');

router.route('/create').post(verifyToken, CreateSet)

module.exports = router;
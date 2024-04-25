const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/Authentication');
const { CreateSet, GetQuizSet } = require('../controllers/quizSetController');

router.route('/create/:id?').post(verifyToken, CreateSet);

router.route('/view/:id').get(verifyToken, GetQuizSet)

module.exports = router;
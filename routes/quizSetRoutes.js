const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/Authentication');
const { CreateSet, GetQuizSet, DeleteQuizSet } = require('../controllers/quizSetController');

router.route('/create/:id?').post(verifyToken, CreateSet);

router.route('/view/:id').get(verifyToken, GetQuizSet)

router.route('/:id').delete(verifyToken, DeleteQuizSet);

module.exports = router;
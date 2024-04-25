const express = require('express');
const { verifyToken } = require('../middleware/Authentication');
const { ViewAllQuiz, ViewOneQuiz } = require('../controllers/quizController');
const router = express.Router();

router.route('/view/all').get(verifyToken, ViewAllQuiz);
router.route('/view/:id').get(verifyToken, ViewOneQuiz);

module.exports = router;
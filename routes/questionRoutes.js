const express = require('express');
const { verifyToken } = require('../middleware/Authentication');
const { CreateQuestion, EditQuestion, DeleteQuestion, GetSubtopics, GetSubjects, GetQuestions } = require('../controllers/questionController');
const router = express.Router();

router.route('/create').post(verifyToken, CreateQuestion);

router.route('/getSubjects').get(GetSubjects);

router.route('/getSubtopics').post(GetSubtopics);

router.route('/getQuestions').post(GetQuestions);

router.route('/:id')
.patch(verifyToken, EditQuestion)
.delete(verifyToken, DeleteQuestion);

module.exports = router;
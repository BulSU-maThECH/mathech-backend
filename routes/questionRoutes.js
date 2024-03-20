const express = require('express');
const { verifyToken } = require('../middleware/Authentication');
const { CreateQuestion, ViewQuestion, EditQuestion, DeleteQuestion, GetSubtopics, GetSubjects } = require('../controllers/questionController');
const router = express.Router();

router.route('/create').post(verifyToken, CreateQuestion);

router.route('/getSubjects').get(GetSubjects);

router.route('/getSubtopics').post(GetSubtopics);

router.route('/:id')
.get(ViewQuestion)
.patch(verifyToken, EditQuestion)
.delete(verifyToken, DeleteQuestion);

module.exports = router;
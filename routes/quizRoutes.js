const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/Authentication');

router.post('/create', (req, res) => {
    quizController.createQuiz(req.body).then(resultFromController => res.send(resultFromController));
});

router.get('/view/:id', (req, res) => {
    quizController.viewQuiz(req.params).then(resultFromController => res.send(resultFromController));
});

router.patch('/edit/:id', auth.verifyUser, (req, res) => {
    quizController.editQuiz(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

router.delete('/delete/:id', auth.verifyUser, (req, res) => {
    quizController.deleteQuiz(req.params).then(resultFromController => res.send(resultFromController));
});

module.exports = router;
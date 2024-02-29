const express = require('express');
const router = express.Router();
const quizSetController = require('../controllers/quizSetController');
const auth = require('../middleware/Authentication');

router.post('/create', (req, res) => {
    quizSetController.createQuizSet(req.body).then(resultFromController => res.send(resultFromController));
});

router.get('/view/:id', (req, res) => {
    quizSetController.viewQuizSet(req.params).then(resultFromController => res.send(resultFromController));
});

router.patch('/edit/:id', auth.verifyUser, (req, res) => {
    quizSetController.editQuizSet(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

router.delete('/delete/:id', auth.verifyUser, (req, res) => {
    quizSetController.deleteQuizSet(req.params).then(resultFromController => res.send(resultFromController));
});

module.exports = router;
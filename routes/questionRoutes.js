const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/Authentication');

router.post('/create', (req, res) => {
    questionController.createQuestion(req.body).then(resultFromController => res.send(resultFromController));
});

router.get('/view/:id', (req, res) => {
    questionController.viewQuestion(req.params).then(resultFromController => res.send(resultFromController));
});

router.patch('/edit/:id', auth.verifyUser, (req, res) => {
    questionController.editQuestion(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

router.delete('/delete/:id', auth.verifyUser, (req, res) => {
    questionController.deleteQuestion(req.params).then(resultFromController => res.send(resultFromController));
});

module.exports = router;
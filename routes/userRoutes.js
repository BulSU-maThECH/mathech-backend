const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/Authentication');

router.post('/check-exists', (req, res) => {
    userController.checkAccountExist(req.body).then(resultFromController => res.send(resultFromController));
});

router.post('/signup', (req, res) => {
    userController.signup(req.body).then(resultFromController => res.send(resultFromController));
});

router.post('/login', (req, res) => {
    userController.login(req.body).then(resultFromController => res.send(resultFromController));
});

router.get('/details', (req, res) => {
    userController.details(req.headers).then(resultFromController => res.send(resultFromController));
});

router.patch('/edit/:id', auth.verifyUser, (req, res) => {
    userController.edit(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

router.patch('/deactivate/:id', auth.verifyUser, (req, res) => {
    userController.deactivate(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

router.patch('/activate/:id', (req, res) => {
    userController.activate(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { CheckUserExist, RegisterUser, LoginUser, UserDetails, EditUser, DeleteUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/Authentication');

router.route('/check-exists').post(CheckUserExist);

router.route('/signup').post(RegisterUser);

router.route('/login').post(LoginUser);

router.route('/details').get(UserDetails);

router.route('/:id')
    .patch(verifyToken, EditUser)
    .delete(verifyToken, DeleteUser);

module.exports = router;
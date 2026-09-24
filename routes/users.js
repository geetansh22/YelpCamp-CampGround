const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const users = require('../controllers/users')
const { storeReturnTo } = require('../middleware');
const user = require('../models/user');


router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.newUser))

router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout);

module.exports = router;
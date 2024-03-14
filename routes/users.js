const express = require('express')
const router = express.Router();
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

const users = require('../controllers/users')

const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const passport = require('passport');

router.get('/register', users.renderRegister)

router.post('/register', catchAsync ( users.register))

router.get('/login', users.renderLogin )

router.post('/login', storeReturnTo , passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout);

module.exports = router;
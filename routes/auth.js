const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const router = express.Router();
const utils = require('../lib/utils');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


// @desc    Register new user with local passport strategy
// @route   GET /auth/register
router.post('/register', (req, res, next) => {

    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });
    newUser.save()
        .then((user) => {
            res.redirect('/dashboard');
        })
        .catch ((err) => {
            console.error(err)
        });

});


// @desc    Log in a user with local passport strategy
// @route   GET /auth/login
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/dashboard' }
    ));


// @desc    Test if a user is logged in (local passport strategy)
// @route   GET /auth/protected-route
router.get('/protected-route', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1>');
    } else {
        res.send('<h1>You are not authenticated</h1>');
    }
});


// @desc    Auth with Facebook
// @route   GET /auth/facebook
router.get('/facebook',
    passport.authenticate('facebook', { scope: ['user_friends', 'email'] }));


// @desc    Facebook auth callback
// @route   GET /auth/facebook/callback
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/dashboard');
    });


// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))


// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/'
    }))


// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
    res.cookie('connect.sid', '', {
        maxAge: 0
    });
    req.logout();
    res.redirect('/');
})

module.exports = router
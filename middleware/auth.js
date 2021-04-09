const utils = require('../lib/utils');
const passport = require('passport');

module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}
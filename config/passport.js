const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const UserSocial = require('../models/UserSocial');
const User = require('../models/User');
const utils = require('../lib/utils');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUserSocial = {
            provider: profile.provider,
            profileId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }


        try {
            let user = await UserSocial.findOne({ profileId: profile.id })

            if (user) {
                done(null, user)
            } else {
                user = await UserSocial.create(newUserSocial)

                done(null, user)
            }
        } catch (err) {
            console.error(err)
        }
    }));

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: '/auth/facebook/callback',
            profileFields: ['id', 'first_name', 'last_name', 'displayName', 'photos', 'email']
        },
        async function(accessToken, refreshToken, profile, done) {
            // In this example, the user's Facebook profile is supplied as the user
            // record.  In a production-quality application, the Facebook profile should
            // be associated with a user record in the application's database, which
            // allows for account linking and authentication with other identity
            // providers.

            const newUserSocial = {
                provider: profile.provider,
                profileId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }


            try {
                let user = await UserSocial.findOne({ profileId: profile.id })

                if (user) {
                    done(null, user)
                } else {
                    user = await UserSocial.create(newUserSocial)

                    done(null, user)
                }
            } catch (err) {
                console.error(err)
            }


            // console.log('facebook/callback')

            // return cb(null, profile);
        }));

    passport.use(new LocalStrategy(
        function(username, password, cb) {
            User.findOne({ username: username })
                .then((user) => {
                    if (!user) { return cb(null, false) }

                    // Function defined at bottom of app.js
                    const isValid = utils.validPassword(password, user.hash, user.salt);

                    if (isValid) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                    }
                })
                .catch((err) => {
                    cb(err);
                });
        }));

/* passport.session() - This calls the Passport Authenticator using the "Session Strategy".  Here are the basic
    * steps that this method takes:
        *      1.  Takes the MongoDB user ID obtained from the `passport.initialize()` method
        * (run directly before) and passes
    *          it to the `passport.deserializeUser()` function (defined above in this module).  The `
    * passport.deserializeUser()`
    *          function will look up the User by the given ID in the database and return it.
        *      2.  If the `passport.deserializeUser()` returns a user object, this user object is assigned
        * to the `req.user` property
    *          and can be accessed within the route.  If no user is returned, nothing happens and `next()` is called.
    */


    passport.serializeUser(function(user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, async function (err, user) {
            if (user === null) {
                return done(err, await UserSocial.findById(id))
            }
            done(err, user)
        })
    })
}
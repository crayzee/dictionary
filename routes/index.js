const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/Story');
const Book = require('../models/Book');

// @desc   Login/Landing page
// @route  GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
})

// @desc   Register Page
// @route  GET /register
router.get('/register', ensureGuest, (req, res) => {
    res.render('register', {
        layout: 'login',
    });
})

// @desc   Dashboard
// @route  GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render('dashboard', {
            name: req.user.displayName || req.user.username,
            stories
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }


})

// @desc   Show single book
// @route  GET /book
router.get('/book', async (req, res) => {
    try {
        let book = await Book.find({file_name: 'M_Mitchell_Gone_with_the_wind.txt'})
            .lean()


        if (!book) {
            return res.render('error/404');
        }

        res.render('stories/book', {
            book: book[0].contents,
        })
    } catch (err) {
        console.error(err)
        res.render('error/404');
    }
});

module.exports = router
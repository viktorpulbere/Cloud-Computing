'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        heading: 'Search nearby places really quick 🥰'
    });
});

module.exports = router;
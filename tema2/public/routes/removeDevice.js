'use strict';

const { Router } = require('../../utils/app');
const router = new Router();

router.get('/', (req, res) => {
    res.json({
        hello: 'World'
    });
});

router.post('/', (req, res) => {
    res.json({
        hello: 'Nigga'
    });
});

module.exports = router;
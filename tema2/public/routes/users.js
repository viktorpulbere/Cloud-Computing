'use strict';

const { Router } = require('../../utils/app');
const router = new Router();
const shared = require('../../utils/serviceVars');

router.post('/users/:id', async (req, res) => {
    const body = req.body;
    console.log(body)

    try {
        // const user = await shared.mongo.users.insertOne({ hello: 'world' });

        res.json({
            hello: {}
        });
    } catch (err) {
        console.log(err);
    }
});

router.get('/users/:id', async (req, res) => {
    res.json({
        hello: 'Nigga'
    });
});

module.exports = router;
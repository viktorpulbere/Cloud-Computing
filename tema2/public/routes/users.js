'use strict';

const { Router } = require('../../utils/app');
const router = new Router();
const shared = require('../../utils/serviceVars');
const schema = require('../../schema');
const tv4 = require('tv4');
const { ObjectID } = require('mongodb');

router.post('/users', async (req, res) => {
    try {
        const userInfo = req.body;

        if (!tv4.validate(userInfo, schema.user)) {
            return res.json({
                message: 'Request is not valid'
            }, 422);
        }

        const { insertedId: userId } = await shared.mongo.users.insertOne(userInfo);

        res.json({ userId }, 201);
    } catch (err) {
        if (err.code && err.code === 11000) {
            return res.json({
                message: 'User email already exists'
            }, 409);
        }
        
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

router.post('/users/:id', async (req, res) => {
    try {
        const userInfo = req.body;
        const id = req.params.id;

        if (!tv4.validate(userInfo, schema.user) || !tv4.validate(id, schema.ID)) {
            return res.json({
                message: 'Request is not valid'
            }, 422);
        }

        userInfo._id = ObjectID(id);

        const { insertedId: userId } = await shared.mongo.users.insertOne(userInfo);

        res.json({ userId }, 201);
    } catch (err) {
        if (err.code && err.code === 11000) {
            let message = 'User email already exists';

            if (err.keyPattern.hasOwnProperty('_id')) {
                message = 'User id already exists';
            }

            return res.json({ message }, 409);
        }
        
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

module.exports = router;
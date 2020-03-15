'use strict';

const { Router } = require('../../utils/app');
const shared = require('../../utils/serviceVars');
const schema = require('../../schema');

const { ObjectID } = require('mongodb');
const tv4 = require('tv4');
const _ = require('lodash');

const router = new Router();

router.post('/users', async (req, res) => {
    try {
        const userInfo = req.body;

        if (!tv4.validate(userInfo, schema.user)) {
            return res.json({
                message: 'Invalid request'
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
                message: 'Invalid request'
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

router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        if (!tv4.validate(userId, schema.ID)) {
            return res.json({
                message: 'Invalid request'
            }, 422);
        }

        const user = await shared.mongo.users.findOne({ 
            _id: ObjectID(userId) 
        }, { 
            projection: { _id: 0, job: 0 } 
        });

        if (user === null) {
            res.json({
                message: 'User not found'
            }, 404);
        }

        res.json(user, 200);
    } catch (err) {
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

router.get('/users', async (req, res) => {
    try {
        const querystring = req.querystring;
        const page = parseInt(
            _.get(querystring, 'page', 1)
        );
        let pageLimit = parseInt(
            _.get(querystring, 'limit', 10)
        );

        if (page < 0 || pageLimit < 0) {
            return res.json({
                message: 'Bad request'
            }, 400);
        }

        if (pageLimit > 100) {
            pageLimit = 100;
        }

        const users = await shared.mongo.users
            .find({}, { projection: { job: 0 } })
            .skip(pageLimit * (page - 1))
            .limit(pageLimit)
            .toArray();
            
        res.json(users, 200);
    } catch (err) {
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

module.exports = router;
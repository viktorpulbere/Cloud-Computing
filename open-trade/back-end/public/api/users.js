'use strict';

const tv4 = require('tv4');
const express = require('express');

const router = express.Router();
const shared = require('../../utils/service_vars');
const schema = require('../../validation/schema');
const authMiddleware = require('../../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
    const userModel = req.body;

    if (!tv4.validate(userModel, schema.user)) {
        res.statusCode = 422;
        return res.json({
            error_code: 1101,
            message: tv4.error.message
        });
    }
    userModel.userId = userModel.email;

    try {
        const user = await shared.mongo.users.insertOne(userModel);

        res.statusCode = 201;
        res.json({
            userId: user.insertedId
        });
    } catch (e) {
        if (e.code && e.code === 11000) {
            res.statusCode = 409;
            return res.json({
                error_code: 1106,
                message: 'User with the specified email already exists'
            });
        }

        res.statusCode = 500;
        res.json({
            error_code: 1103,
            message: 'Internal server error'
        });
    }
});

router.get('/:userEmail', authMiddleware, async (req, res) => {
    const { userEmail } = req.params;

    try {
        const user = await shared.mongo.users.findOne({ userId: userEmail });

        if (!user) {
            return res.json({
                registered: 0
            });
        }

        res.json({
            registered: 1
        });
    } catch (e) {
        res.statusCode = 500;
        res.json({
            error_code: 1103,
            message: 'Internal server error'
        });
    }
});

module.exports = router;

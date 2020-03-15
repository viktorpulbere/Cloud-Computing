'use strict';

const { Router } = require('../../utils/app');
const router = new Router();
const shared = require('../../utils/serviceVars');
const schema = require('../../schema');
const tv4 = require('tv4');
const { ObjectID } = require('mongodb');

router.post('/users/:userId/devices', async (req, res) => {
    try {
        const deviceInfo = req.body;
        const { userId } = req.params;

        if (!tv4.validate(deviceInfo, schema.device) || !tv4.validate(userId, schema.ID)) {
            return res.json({
                message: 'Invalid request'
            }, 422);
        }

        const user = await shared.mongo.users.findOne({ _id: ObjectID(userId) });
        
        if (user === null) {
            return res.json({ 
                message: 'User not found' 
            }, 404);
        }
        
        deviceInfo.userId = userId;
        const { insertedId: deviceId } = await shared.mongo.devices.insertOne(deviceInfo);

        res.json({ deviceId }, 201);
    } catch (err) {
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

router.delete('/users/:userId/devices', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!tv4.validate(userId, schema.ID)) {
            return res.json({
                message: 'Invalid request'
            }, 422);
        }

        const user = await shared.mongo.users.findOne({ _id: ObjectID(userId) });
        
        if (user === null) {
            return res.json({ 
                message: 'User not found' 
            }, 404);
        }
        
        const { deletedCount } = await shared.mongo.devices.deleteMany({ userId });

        res.json({ deletedCount }, 200);
    } catch (err) {
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

router.delete('/users/:userId/devices/:deviceId', async (req, res) => {
    try {
        const { userId, deviceId } = req.params;

        if (!tv4.validate(userId, schema.ID) || !tv4.validate(deviceId, schema.ID)) {
            return res.json({
                message: 'Invalid request'
            }, 422);
        }

        const user = await shared.mongo.users.findOne({ _id: ObjectID(userId) });
        
        if (user === null) {
            return res.json({ 
                message: 'User not found' 
            }, 404);
        }
        
        const { deletedCount } = await shared.mongo.devices.deleteMany({ userId, _id: ObjectID(deviceId) });

        if (deletedCount === 0) {
            return res.json({ 
                message: 'Device not found'
            }, 404);
        }

        res.json({ deletedCount }, 200);
    } catch (err) {
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

router.patch('/users/:userId/devices/:deviceId', async (req, res) => {
    try {
        const { userId, deviceId } = req.params;
        const updateExpression = req.body;

        if (!tv4.validate(userId, schema.ID) || !tv4.validate(deviceId, schema.ID)) {
            return res.json({
                message: 'Invalid request'
            }, 422);
        }

        if (!tv4.validate(updateExpression, schema.updateDevice)) {
            return res.json({
                message: 'Not allowed'
            }, 405);
        }

        const user = await shared.mongo.users.findOne({ _id: ObjectID(userId) });
        
        if (user === null) {
            return res.json({ 
                message: 'User not found' 
            }, 404);
        }
        
        const result = await shared.mongo.devices.updateOne({ 
            userId, 
            _id: ObjectID(deviceId) 
        }, { 
            $set: updateExpression 
        });

        if (!result.matchedCount) {
            return res.json({ 
                message: 'Device not found' 
            }, 404); 
        }

        res.json({
            success: 1
        }, 200);
    } catch (err) {
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

module.exports = router;
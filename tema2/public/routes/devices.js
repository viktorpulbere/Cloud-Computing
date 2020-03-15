'use strict';

const { Router } = require('../../utils/app');
const shared = require('../../utils/serviceVars');
const schema = require('../../schema');

const { ObjectID } = require('mongodb');
const tv4 = require('tv4');
const _ = require('lodash');

const router = new Router();

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
        deviceInfo.lastUpdate = Date.now();

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
            $set: { 
                ... updateExpression,
                lastUpdate: Date.now()
            } 
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

router.patch('/users/:userId/devices', async (req, res) => {
    try {
        const { userId } = req.params;
        const updateExpression = req.body;

        if (!tv4.validate(userId, schema.ID)) {
            return res.json({
                message: 'Invalid request'
            }, 422);
        }

        if (!tv4.validate(updateExpression, schema.updateDevices)) {
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
        
        const result = await shared.mongo.devices.updateMany({ userId }, { 
            $set: { 
                ... updateExpression,
                lastUpdate: Date.now()
            }  
        });

        res.json({
            matched: result.matchedCount,
            modified: result.modifiedCount 
        }, 200);
    } catch (err) {
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

router.get('/users/:userId/devices', async (req, res) => {
    try {
        const querystring = req.querystring;
        const { userId } = req.params;
        const page = parseInt(
            _.get(querystring, 'page', 1)
        );
        const status = parseInt(
            _.get(querystring, 'status', -1)
        );
        let pageLimit = parseInt(
            _.get(querystring, 'limit', 10)
        );
        const type = _.get(querystring, 'type', null);

        if (page < 0 || pageLimit < 0) {
            return res.json({
                message: 'Bad request'
            }, 400);
        }

        if (pageLimit > 100) {
            pageLimit = 100;
        }

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
        
        const query = { userId };
        if (status != -1) {
            query.status = status;
        }

        if (type) {
            query.type = type;
        }

        const devices = await shared.mongo.devices
            .find(query, { projection: { _id: 0, userId: 0, lastUpdate: 0 } })
            .skip(pageLimit * (page - 1))
            .limit(pageLimit)
            .toArray();
            
        res.json(devices, 200);
    } catch (err) {
        res.json({
            message: 'Internal Server Error'
        }, 500);
    }
});

module.exports = router;
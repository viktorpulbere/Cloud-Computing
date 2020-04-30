'use strict';

const tv4 = require('tv4');
const express = require('express');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const router = express.Router();
const shared = require('../../utils/service_vars');
const schema = require('../../validation/schema');
const authMiddleware = require('../../middleware/auth');

router.get('/products', authMiddleware, async (req, res) => {
    const { email: userId } = req.user;

    try {
        const products = await shared.mongo.transactions.find({
            active: 1, destination: userId
        }, {
            projection: { _id: 0, destination: 0, active: 0 }
        }).toArray();
        const locationArr = products.map(product => {
            return shared.mongo.users.findOne({ userId: product.source }, { projection: { location: 1, _id: 0 } })
        });
        const locationInfo = await Promise.all(locationArr);
        const response = products.map((product, idx) => ({
            ... product,
            location: locationInfo[idx] && locationInfo[idx].location
            ? locationInfo[idx].location : {}
        }));

        res.json(response);
    } catch (e) {
        res.statusCode = 500;
        res.json({
            error_code: 1103,
            message: 'Internal server error'
        });
    }
});

router.get('/products/:productId', authMiddleware, async (req, res) => {
    const { productId } = req.params;

    if (!tv4.validate(productId, schema.ID)) {
        res.statusCode = 400;
        return res.json({
            error_code: 1101,
            message: tv4.error.message
        });
    }

    try {
        const product = await shared.mongo.products.findOne({ _id: ObjectID(productId) });

        if (!product) {
            res.statusCode = 404;
            return res.json({
                error_code: 1102,
                message: 'Product not found'
            });
        }

        res.json(product);
    } catch (e) {
        res.statusCode = 500;
        res.json({
            error_code: 1103,
            message: 'Internal server error'
        });
    }
});

router.post('/products', authMiddleware,  async (req, res) => {
    const productModel = {
        ... req.body,
        origin: req.user.email
    };

    if (!tv4.validate(productModel, schema.product)) {
        res.statusCode = 422;
        return res.json({
            error_code: 1101,
            message: tv4.error.message
        });
    }

    try {
        const product = await shared.mongo.products.insertOne(productModel);

        const hash = shared.hash(_.pick(productModel, ['name', 'description']));
        await shared.contract.methods.createProduct(product.insertedId.toString(), req.user.email, 'hash').send();

        res.statusCode = 201;
        res.json({
            productId: product.insertedId
        });
    } catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.json({
            error_code: 1103,
            message: 'Internal server error'
        });
    }
});

router.get('/trace/:productId', authMiddleware, async (req, res) => {
    const { productId } = req.params;

    if (!tv4.validate(productId, schema.ID)) {
        res.statusCode = 400;
        return res.json({
            error_code: 1101,
            message: tv4.error.message
        });
    }

    try {
        const transactions = await shared.mongo.transactions.find({productId}).toArray();
        const locationArr = transactions.map(transaction => {
            return shared.mongo.users.findOne({ userId: transaction.source }, { projection: { location: 1, _id: 0 } })
        });
        const locationInfo = await Promise.all(locationArr);
        const response = transactions.map((transaction, idx) => ({
            ... transaction,
            location: locationInfo[idx] && locationInfo[idx].location
                ? locationInfo[idx].location : {}
        }));

        res.json(response);
    } catch (e) {
        res.statusCode = 500;
        res.json({
            error_code: 1103,
            message: 'Internal server error'
        });
    }
});

module.exports = router;

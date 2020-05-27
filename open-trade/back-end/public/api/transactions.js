'use strict';

const _ = require('lodash');
const tv4 = require('tv4');
const express = require('express');
const { ObjectID } = require('mongodb');

const router = express.Router();
const shared = require('../../utils/service_vars');
const schema = require('../../validation/schema');
const authMiddleware = require('../../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.email;
        const querystring = req.query;
        const { pending } = querystring;

        const query = pending === '0'
            ? { source: userId, active: 1 }
            : { destination: userId, active: 1 };

        let page = parseInt(
            _.get(querystring, 'page', 1)
        );
        let pageLimit = parseInt(
            _.get(querystring, 'limit', 10)
        );

        if (page < 0 || pageLimit < 0) {
            page = 1;
            pageLimit = 10;
        }

        if (pageLimit > 100) {
            pageLimit = 100;
        }

        const transactions = await shared.mongo.transactions
            .find(query)
            .skip(pageLimit * (page - 1))
            .limit(pageLimit)
            .toArray();

        const promiseArray = transactions.map(transaction => {
            return shared.mongo.products.findOne({
                _id: ObjectID(transaction.productId)
            }, {
                projection: { name: 1, _id: 0, description: 1 }
            })
        });
        const products = await Promise.all(promiseArray);
        const response = transactions.map((transaction, idx) => {
            if (products[idx] === null) {
                return transaction;
            }

            return {
                ... transaction,
                productName: products[idx].name,
                productDescription: products[idx].description
            }
        });

        // await transactionsFromWeb3(response);

        res.json(response);
    } catch (e) {
        res.statusCode = 500;
        res.json({
            error_code: 1103,
            message: 'Internal server error'
        });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const transactionModel = {
        ... req.body,
        source: req.user.email
    };

    if (!tv4.validate(transactionModel, schema.transaction)) {
        res.statusCode = 422;
        return res.json({
            error_code: 1101,
            message: tv4.error.message
        });
    }

    try {
        const updateInfo = await shared.mongo.transactions.findOneAndUpdate(
            {productId: transactionModel.productId, active: 1},
            {$set: {active: 0}}
        );
        const transaction = await shared.mongo.transactions.insertOne({...transactionModel, active: 1});
        const response = {transactionId: transaction.insertedId};

        if (!transactionModel.destination) {
            transactionModel.destination = '';
        }
         const blockchainData = {source:transactionModel.source, destination:transactionModel.destination};
         await shared.contract.methods.addTransaction(
             transactionModel.productId, transactionModel.destination, shared.hash(blockchainData)).send();
        await shared.sendAsync(transactionModel.tx);

        res.statusCode = 201;
        res.json(response);
    } catch (e) {
        res.statusCode = 500;
        res.json({
            error_code: 1103,
            message: 'Internal server error'
        });
    }
});

async function transactionsFromWeb3(transactions) {
    transactions.forEach((i,index) => i && i.productId && shared.contract.methods.getTransaction(i.productId, 1).call()
        .then(console.log)
        .catch(console.error));
}

module.exports = router;
